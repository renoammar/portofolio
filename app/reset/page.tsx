import ResetPasswordForm from "./Resetform";
import { Suspense } from "react";
export default function ResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
