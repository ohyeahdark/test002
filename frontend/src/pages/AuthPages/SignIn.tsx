import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Human Resource Managerment"
        description="Human Resource Managerment - ItAiUa"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
