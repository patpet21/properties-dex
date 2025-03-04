
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title PropertiesMarketplace
 * @dev A marketplace for trading ERC20 tokens representing tokenized real estate properties
 */
contract PropertiesMarketplace is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using Counters for Counters.Counter;
    using ECDSA for bytes32;

    // Counter for listing IDs
    Counters.Counter private _listingIdCounter;

    // Fixed addresses
    address public constant PRDX_TOKEN = 0x61Dd008F1582631Aa68645fF92a1a5ECAedBeD19;
    address public constant USDC_TOKEN = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public constant TOKEN_CREATOR = 0x01A3ad1acc738cb60d48E08ccadC769904De256c;
    address public constant FEE_RECIPIENT = 0x7fDECF16574bd21Fd5cce60B701D01A6F83826ab;

    // Fee percentage (0.1% = 1 / 1000)
    uint256 public constant FEE_PERCENTAGE = 1;
    uint256 public constant FEE_DENOMINATOR = 1000;

    // Enum for payment token types
    enum PaymentToken { PRDX, USDC }

    // Struct for token listing
    struct TokenListing {
        uint256 id;
        address seller;
        address tokenAddress;
        string tokenName;
        string tokenSymbol;
        uint256 amount;
        uint256 pricePerToken;
        PaymentToken paymentToken;
        bool referralActive;
        uint256 referralPercent;
        uint256 endTime;
        bool active;
        TokenMetadata metadata;
    }

    // Struct for token metadata
    struct TokenMetadata {
        string projectWebsite;
        string socialMediaLink;
        string tokenImageUrl;
        string telegramUrl;
        string projectDescription;
    }

    // Mapping from listing ID to TokenListing
    mapping(uint256 => TokenListing) public listings;
    
    // Mapping of wallet address => listing ID => referral code
    mapping(address => mapping(uint256 => bytes32)) public walletReferralCodes;
    
    // Mapping of referral code => used status
    mapping(bytes32 => bool) public referralCodeUsed;

    // Events
    event TokenListed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed tokenAddress,
        uint256 amount,
        uint256 pricePerToken,
        PaymentToken paymentToken,
        bool referralActive,
        uint256 endTime
    );

    event TokenPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed tokenAddress,
        uint256 amount,
        uint256 totalPrice,
        PaymentToken paymentToken,
        bytes32 referralCode
    );

    event ListingCancelled(
        uint256 indexed listingId,
        address indexed seller
    );

    event ReferralCodeGenerated(
        uint256 indexed listingId,
        address indexed referrer,
        bytes32 referralCode
    );

    event ReferralPaid(
        uint256 indexed listingId,
        address indexed referrer,
        uint256 amount,
        PaymentToken paymentToken
    );

    /**
     * @dev Modifier to check if a listing exists and is active
     */
    modifier listingExists(uint256 listingId) {
        require(listings[listingId].active, "Listing does not exist or is not active");
        require(block.timestamp < listings[listingId].endTime, "Listing has expired");
        _;
    }

    /**
     * @dev Modifier to check if caller is the seller of a listing
     */
    modifier onlySeller(uint256 listingId) {
        require(listings[listingId].seller == msg.sender, "Only the seller can perform this action");
        _;
    }

    /**
     * @dev Creates a new token listing
     * @param tokenAddress Address of the ERC20 token
     * @param amount Amount of tokens to list
     * @param pricePerToken Price per token in payment token units
     * @param paymentToken Enum value for payment token (PRDX = 0, USDC = 1)
     * @param durationInSeconds Duration of the listing in seconds
     * @param referralActive Whether referral is active for this listing
     * @param referralPercent Percentage of sale to give to referrer (1-100)
     * @param metadata Struct containing additional metadata for the listing
     */
    function listToken(
        address tokenAddress,
        uint256 amount,
        uint256 pricePerToken,
        PaymentToken paymentToken,
        uint256 durationInSeconds,
        bool referralActive,
        uint256 referralPercent,
        TokenMetadata memory metadata
    ) external nonReentrant returns (uint256) {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        require(pricePerToken > 0, "Price must be greater than 0");
        require(durationInSeconds >= 3600, "Duration must be at least 1 hour");
        require(durationInSeconds <= 90 days, "Duration cannot exceed 90 days");
        
        if (referralActive) {
            require(referralPercent >= 1 && referralPercent <= 100, "Referral percentage must be between 1 and 100");
        } else {
            referralPercent = 0;
        }
        
        // Get token details
        string memory tokenName;
        string memory tokenSymbol;
        
        try IERC20Metadata(tokenAddress).name() returns (string memory name) {
            tokenName = name;
        } catch {
            tokenName = "Unknown Token";
        }
        
        try IERC20Metadata(tokenAddress).symbol() returns (string memory symbol) {
            tokenSymbol = symbol;
        } catch {
            tokenSymbol = "???";
        }
        
        // Transfer tokens to the marketplace
        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
        
        // Create listing
        uint256 listingId = _listingIdCounter.current();
        _listingIdCounter.increment();
        
        listings[listingId] = TokenListing({
            id: listingId,
            seller: msg.sender,
            tokenAddress: tokenAddress,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            amount: amount,
            pricePerToken: pricePerToken,
            paymentToken: paymentToken,
            referralActive: referralActive,
            referralPercent: referralPercent,
            endTime: block.timestamp + durationInSeconds,
            active: true,
            metadata: metadata
        });
        
        emit TokenListed(
            listingId,
            msg.sender,
            tokenAddress,
            amount,
            pricePerToken,
            paymentToken,
            referralActive,
            block.timestamp + durationInSeconds
        );
        
        return listingId;
    }

    /**
     * @dev Purchase tokens from a listing
     * @param listingId ID of the listing
     * @param amount Amount of tokens to purchase
     * @param referralCode Optional referral code
     */
    function purchaseTokens(
        uint256 listingId,
        uint256 amount,
        bytes32 referralCode
    ) external nonReentrant listingExists(listingId) {
        TokenListing storage listing = listings[listingId];
        
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= listing.amount, "Not enough tokens available");
        
        // Calculate total price
        uint256 totalPrice = amount * listing.pricePerToken;
        
        // Get the payment token address
        address paymentTokenAddress = listing.paymentToken == PaymentToken.PRDX ? PRDX_TOKEN : USDC_TOKEN;
        
        // Validate potential referral
        address referrer = address(0);
        uint256 referralAmount = 0;
        
        if (referralCode != bytes32(0) && listing.referralActive) {
            // Check if referral code is valid and unused
            require(!referralCodeUsed[referralCode], "Referral code already used");
            
            // Find the referrer by checking all potential referral codes
            bool foundReferrer = false;
            
            // In a real implementation, you would have a more efficient way to look up referrers
            // For simplicity, we're using a very basic approach
            for (uint256 i = 0; i < _listingIdCounter.current(); i++) {
                address potentialReferrer = address(uint160(uint256(keccak256(abi.encodePacked(referralCode, i)))));
                if (walletReferralCodes[potentialReferrer][listingId] == referralCode) {
                    referrer = potentialReferrer;
                    foundReferrer = true;
                    break;
                }
            }
            
            require(foundReferrer, "Invalid referral code");
            require(referrer != msg.sender, "Cannot use your own referral code");
            require(referrer != listing.seller, "Cannot use seller's referral code");
            
            // Calculate referral amount
            referralAmount = (totalPrice * listing.referralPercent) / 100;
            
            // Mark referral code as used
            referralCodeUsed[referralCode] = true;
        }
        
        // Calculate platform fee (0.1%)
        uint256 platformFee = (totalPrice * FEE_PERCENTAGE) / FEE_DENOMINATOR;
        
        // Calculate amount that goes to seller
        uint256 sellerAmount = totalPrice - platformFee - referralAmount;
        
        // Transfer payment token from buyer to seller, fee recipient, and referrer
        IERC20(paymentTokenAddress).safeTransferFrom(msg.sender, listing.seller, sellerAmount);
        IERC20(paymentTokenAddress).safeTransferFrom(msg.sender, FEE_RECIPIENT, platformFee);
        
        if (referralAmount > 0 && referrer != address(0)) {
            IERC20(paymentTokenAddress).safeTransferFrom(msg.sender, referrer, referralAmount);
            emit ReferralPaid(listingId, referrer, referralAmount, listing.paymentToken);
        }
        
        // Transfer tokens from marketplace to buyer
        IERC20(listing.tokenAddress).safeTransfer(msg.sender, amount);
        
        // Update listing amount
        listing.amount -= amount;
        
        // If all tokens are sold, deactivate the listing
        if (listing.amount == 0) {
            listing.active = false;
        }
        
        emit TokenPurchased(
            listingId,
            msg.sender,
            listing.tokenAddress,
            amount,
            totalPrice,
            listing.paymentToken,
            referralCode
        );
    }

    /**
     * @dev Cancel a listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external nonReentrant onlySeller(listingId) {
        TokenListing storage listing = listings[listingId];
        
        require(listing.active, "Listing is not active");
        
        // Transfer remaining tokens back to seller
        if (listing.amount > 0) {
            IERC20(listing.tokenAddress).safeTransfer(listing.seller, listing.amount);
        }
        
        // Deactivate listing
        listing.active = false;
        
        emit ListingCancelled(listingId, msg.sender);
    }

    /**
     * @dev Generate a unique referral code for a wallet and listing
     * @param listingId ID of the listing
     * @return bytes32 The generated referral code
     */
    function generateReferralCode(uint256 listingId) external listingExists(listingId) returns (bytes32) {
        TokenListing storage listing = listings[listingId];
        
        require(listing.referralActive, "Referrals not active for this listing");
        require(msg.sender != listing.seller, "Seller cannot generate referral code");
        
        // Check if a code already exists
        if (walletReferralCodes[msg.sender][listingId] != bytes32(0)) {
            return walletReferralCodes[msg.sender][listingId];
        }
        
        // Generate unique referral code
        bytes32 referralCode = keccak256(abi.encodePacked(
            msg.sender,
            listingId,
            block.timestamp,
            blockhash(block.number - 1)
        ));
        
        walletReferralCodes[msg.sender][listingId] = referralCode;
        
        emit ReferralCodeGenerated(listingId, msg.sender, referralCode);
        
        return referralCode;
    }

    /**
     * @dev Get a wallet's referral code for a listing
     * @param wallet The wallet address
     * @param listingId ID of the listing
     * @return The referral code
     */
    function getWalletReferralCode(address wallet, uint256 listingId) external view returns (bytes32) {
        return walletReferralCodes[wallet][listingId];
    }

    /**
     * @dev Get listing details
     * @param listingId ID of the listing
     * @return The listing details
     */
    function getListingDetails(uint256 listingId) external view returns (TokenListing memory) {
        return listings[listingId];
    }

    /**
     * @dev Get listing metadata
     * @param listingId ID of the listing
     * @return The listing metadata
     */
    function getListingMetadata(uint256 listingId) external view returns (TokenMetadata memory) {
        return listings[listingId].metadata;
    }

    /**
     * @dev Get all active listing IDs
     * @return Array of active listing IDs
     */
    function getActiveListings() external view returns (uint256[] memory) {
        uint256 totalListings = _listingIdCounter.current();
        uint256[] memory activeIds = new uint256[](totalListings);
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < totalListings; i++) {
            if (listings[i].active && block.timestamp < listings[i].endTime) {
                activeIds[activeCount] = i;
                activeCount++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeIds[i];
        }
        
        return result;
    }
}

/**
 * @dev Interface for ERC20 tokens with metadata
 */
interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
}
