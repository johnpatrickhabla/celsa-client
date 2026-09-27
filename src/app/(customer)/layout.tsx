import CustomerNavbar from "@/components/customer/CustomerNavbar";
import CustomerFooter from "@/components/customer/CustomerFooter";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomerNavbar />
      <main>{children}</main>
      <CustomerFooter />
    </>
  );
}
