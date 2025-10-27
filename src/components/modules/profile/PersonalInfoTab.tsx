// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import type { IUser } from "@/interface";
// import type { JSX } from "react";


// interface IPersonalInfoTabProps {
//   userInfo: IUser;
// }

// const PersonalInfoTab = ({ userInfo }: IPersonalInfoTabProps): JSX.Element => {
//   const { name, email, phone, address } = userInfo;

//   return (
//     <Card className="shadow-md border border-border">
//       <CardHeader>
//         <CardTitle>Personal Information</CardTitle>
//         <CardDescription>Your account details</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <Label className="text-muted-foreground">Full Name</Label>
//             <div className="mt-2 font-medium">{name}</div>
//           </div>
//           <div>
//             <Label className="text-muted-foreground">Email</Label>
//             <div className="mt-2 font-medium">{email}</div>
//           </div>
//           <div>
//             <Label className="text-muted-foreground">Phone</Label>
//             <div className="mt-2 font-medium">{phone || "-"}</div>
//           </div>
//           <div>
//             <Label className="text-muted-foreground">Address</Label>
//             <div className="mt-2 font-medium">
//               {address?.city || address?.country
//                 ? `${address?.city || ""} ${address?.country ? `, ${address.country}` : ""}`
//                 : "-"}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PersonalInfoTab





import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import type { IUser } from "@/interface";
import type { JSX } from "react";
import { Mail, Phone, MapPin, User as UserIcon } from "lucide-react";

interface IPersonalInfoTabProps {
  userInfo: IUser;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 }
  }
};

const PersonalInfoTab = ({ userInfo }: IPersonalInfoTabProps): JSX.Element => {
  const { name, email, phone, address } = userInfo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-2xl">Personal Information</CardTitle>
          <CardDescription className="text-base">Your account details and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl bg-gradient-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>
                <Label className="text-muted-foreground text-sm">Full Name</Label>
              </div>
              <div className="font-semibold text-lg">{name}</div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl bg-gradient-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <Label className="text-muted-foreground text-sm">Email</Label>
              </div>
              <div className="font-semibold text-lg break-all">{email}</div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl bg-gradient-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <Label className="text-muted-foreground text-sm">Phone</Label>
              </div>
              <div className="font-semibold text-lg">{phone || "Not provided"}</div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="p-5 rounded-xl bg-gradient-card border shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <Label className="text-muted-foreground text-sm">Address</Label>
              </div>
              <div className="font-semibold text-lg">
                {address?.city || address?.country
                  ? `${address?.city || ""} ${address?.country ? `, ${address.country}` : ""}`
                  : "Not provided"}
              </div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PersonalInfoTab;
