import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Tab,
  Tabs,
} from "@nextui-org/react";

export interface UserFromInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onValueChange: (value: string) => void;
}

export interface UserFromButton {
  text: string;
  onClick: (e: any) => void;
}

export interface UserFromProps {
  className: string;
  title: string;
  subtitle: string;
  inputs: UserFromInputProps[];
  status: string;
  selectedType: React.Key;
  setSelectedType: (type: React.Key) => void;
  primaryButton: UserFromButton;
  secondaryButton: UserFromButton;
}

/**
 * The form for login or register
 */
export const UserForm: React.FC<UserFromProps> = ({
  className,
  title,
  subtitle,
  inputs,
  status,
  selectedType,
  setSelectedType,
  primaryButton,
  secondaryButton,
}: UserFromProps) => (
  <Card className={className}>
    <CardHeader>
      <div className="mt-4 grid justify-start text-left gap-4">
        <p className="text-xl">{title}</p>
        <p className="text-base">{subtitle}</p>
      </div>
    </CardHeader>
    <CardBody>
      <div className="grid gap-4">
        <div>
          <Tabs
            fullWidth
            aria-label="Options"
            selectedKey={selectedType}
            onSelectionChange={setSelectedType}
          >
            <Tab key="tenant" title="我是租客" />
            <Tab key="landlord" title="我是房東" />
          </Tabs>
        </div>
        <div className="grid gap-4">
          {inputs.map((input) => (
            <Input
              key={input.id}
              disabled={status === "submitting"}
              id={input.id}
              label={input.label}
              type={input.type}
              value={input.value}
              onValueChange={input.onValueChange}
            />
          ))}
        </div>
      </div>
    </CardBody>
    <CardFooter className="grid gap-2">
      <Button
        className="w-full"
        color="primary"
        isDisabled={inputs.some((input) => input.value === "")}
        isLoading={status === "submitting"}
        type="submit"
        onClick={primaryButton.onClick}
      >
        {primaryButton.text}
      </Button>
      <Button
        className="w-full"
        variant="bordered"
        onClick={secondaryButton.onClick}
      >
        {secondaryButton.text}
      </Button>
    </CardFooter>
  </Card>
);
