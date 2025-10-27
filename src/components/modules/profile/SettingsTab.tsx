// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// const SettingsTab = () => {
//   return (
//     <Card className="shadow-md border border-border">
//       <CardHeader>
//         <CardTitle>Account Settings</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="p-4 border rounded-lg flex justify-between items-center">
//           <div>
//             <h3 className="font-semibold">Password</h3>
//             <p className="text-sm text-muted-foreground">
//               Update your password regularly.
//             </p>
//           </div>
//           <Button variant="outline" className="bg-primary text-white">
//             Reset Password
//           </Button>
//         </div>

//         <div className="p-4 border border-destructive/40 bg-destructive/5 rounded-lg flex justify-between items-center">
//           <div>
//             <h3 className="font-semibold text-destructive">Delete Account</h3>
//             <p className="text-sm text-muted-foreground">
//               This action is irreversible.
//             </p>
//           </div>

//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default SettingsTab


import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Key, Trash2 } from "lucide-react";

const SettingsTab = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="p-6 border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Password</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your password regularly for better security.
                </p>
              </div>
            </div>
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/90 text-white shadow-sm whitespace-nowrap"
            >
              Reset Password
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="p-6 border border-destructive/40 bg-destructive/5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-destructive/60 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <Trash2 className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action is irreversible. All your data will be permanently deleted.
                </p>
              </div>
            </div>
            <Button
              variant="destructive"
              className="shadow-sm whitespace-nowrap"
            >
              Delete Account
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SettingsTab;
