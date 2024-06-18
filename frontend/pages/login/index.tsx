import { useState } from "react";
import { useRouter } from "next/navigation";

import { UserForm, UserFromInputProps } from "@/components/userForm";
import { useAuth } from "@/components/hooks/useAuth";
import DefaultLayout from "@/layouts/default";

export default function LoginPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <LoginForm />
        </div>
      </section>
    </DefaultLayout>
  );
}

async function postLogin(username: string, password: string, type: string) {
  const res = await fetch(`${process.env.API_URL}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      type,
    }),
  });

  if (!res.ok) return undefined;

  return res.json();
}

export function LoginForm() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedType, setSelectedType] = useState<React.Key>("tenant");
  const [status, setStatus] = useState("typing");

  const { login } = useAuth();

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const loginRes = await postLogin(
        username,
        password,
        selectedType as string,
      );

      if (loginRes && loginRes.access_token) {
        const user = {
          id: loginRes.access_token,
          name: username,
          type: selectedType as string,
        };

        login(user);

        router.push("/");
      } else {
        window.alert("登入失敗");
        setStatus("typing");
      }
    } catch (err) {
      window.alert(`系統錯誤 ${err}`);
      console.error("Error when login", err);
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
      id: "password",
      label: "密碼",
      type: "password",
      value: password,
      onValueChange: setPassword,
    },
  ];

  const primaryButton = {
    text: "登入",
    onClick: onSubmit,
  };
  const secondaryButton = {
    text: "註冊",
    onClick: () => router.push("/signup"),
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
