import { SiteFooter } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const AuthGroupLayout = async (
    { children }: { children: React.ReactNode }) => {

         const user = await getMe();
  return <div>
    <Navbar user={user}/>
    {children}
    <SiteFooter></SiteFooter>
  
  </div>;
};

export default AuthGroupLayout;