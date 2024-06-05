import Link from "next/link";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Tabs, Tab } from "@nextui-org/react";

export function SignupForm() {
  return (
    <Card className="mx-auto min-w-80">
      <CardHeader>
        <div className="mt-4 grid justify-start text-left gap-4">
          <p className="text-xl">註冊</p>
          <p className="text-base">註冊使用更多功能</p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="grid gap-4">
          <div>
            <Tabs fullWidth aria-label="Options">
              <Tab key="tenants" title="我是租客" />
              <Tab key="landlord" title="我是房東" />
            </Tabs>
          </div>
          <div className="grid gap-4">
            <Input required id="user" label="使用者名稱" type="text" />
            <Input required id="phoneNUm" label="手機號碼" type="text" />
            <Input required id="password" label="密碼" type="password" />
          </div>
        </div>
      </CardBody>
      <CardFooter className="grid gap-2">
        <Button className="w-full" color="primary" type="submit">
          註冊
        </Button>
        <Button as={Link} className="w-full" href="/login" variant="bordered">
          已有帳號，去登入
        </Button>
      </CardFooter>
    </Card>
  );
}
