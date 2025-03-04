
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Disclaimer = () => {
  return (
    <div className="w-full py-10 pb-20">
      <div className="page-container">
        <motion.div 
          className="rounded-xl border border-yellow-600/20 bg-yellow-600/5 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="font-bold text-yellow-500">Risk Disclaimer</h3>
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Cryptocurrency and tokenized assets involve significant risk:</strong> The value of tokens created or traded on Properties DEX can be extremely volatile and may result in partial or total loss of your investment.
              </p>
              
              <p>
                <strong>Regulatory uncertainty:</strong> Real estate tokenization may be subject to evolving regulatory requirements across different jurisdictions. Users are responsible for ensuring compliance with applicable laws.
              </p>
              
              <p>
                <strong>Do your own research:</strong> Properties DEX does not provide investment advice. Before creating, listing, or purchasing any tokens, conduct thorough research and consider consulting with financial and legal professionals.
              </p>
              
              <p>
                <strong>Smart contract risks:</strong> While our platform strives for security, smart contracts may contain vulnerabilities. Users interact with these contracts at their own risk.
              </p>
              
              <p className="pt-2 font-medium">
                By using Properties DEX, you acknowledge understanding these risks and agree to use the platform responsibly.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Disclaimer;
