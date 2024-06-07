import { useState } from "react";
import { useRouter } from "next/navigation";

import DefaultLayout from "@/layouts/default";
import { UserForm, UserFromInputProps } from "@/components/userForm";

export default function SignUpPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <SignupForm />
        </div>
      </section>
    </DefaultLayout>
  );
}

async function postSignup(
  username: string,
  password: string,
  phonenum: string,
  type: string,
) {
  const res = await fetch(`${process.env.API_URL}/signup`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      phonenum,
      type,
    }),
  });

  if (!res.ok) return undefined;

  return res.json();
}

function SignupForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [selectedType, setSelectedType] = useState<React.Key>("tenant");
  const [status, setStatus] = useState("typing");

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const signupRes = await postSignup(
        username,
        password,
        phonenum,
        selectedType as string,
      );

      if (signupRes) {
        // TODO: snackbar or something showing success
        router.push("/login");
      } else {
        window.alert("註冊失敗");
        setStatus("typing");
      }
    } catch (err) {
      window.alert(`系統錯誤 ${err}`);
      console.error("Error when signup", err);
      setStatus("typing");
    }
  };

  const inputs: UserFromInputProps[] = [
    {
      id: "user",
      label: "使用者名稱",
      type: "text",
      value: username,
      onValueChange: setUsername,
    },
    {
      id: "phonenum",
      label: "手機號碼",
      type: "text",
      value: phonenum,
      onValueChange: setPhonenum,
    },
    {
      id: "password",
      label: "密碼",
      type: "password",
      value: password,
      onValueChange: setPassword,
    },
  ];

  const primaryButton = {
    text: "送出",
    onClick: onSubmit,
  };
  const secondaryButton = {
    text: "已有帳號，去登入",
    onClick: () => router.push("/login"),
  };

  return (
    <UserForm
      className="mx-auto min-w-80"
      inputs={inputs}
      primaryButton={primaryButton}
      secondaryButton={secondaryButton}
      selectedType={selectedType}
      setSelectedType={setSelectedType}
      status={status}
      subtitle="登入使用更多功能"
      title="歡迎"
    />
  );
}
