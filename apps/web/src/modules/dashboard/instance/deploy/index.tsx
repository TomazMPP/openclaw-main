import { Card } from "@workspace/ui-web/card";
import { Icons } from "@workspace/ui-web/icons";

import {
  DeployInstanceForm,
  DeployInstanceFormFooter,
  DeployInstanceFormNote,
  DeployInstanceSubmitButton,
} from "~/modules/dashboard/instance/deploy/form";
import { DeployTips } from "~/modules/dashboard/instance/deploy/tips";

export const DeployInstance = () => {
  return (
    <Card className="relative w-full max-w-3xl rounded-[24px] border p-2">
      <DeployInstanceForm>
        <DeployTips />
        <DeployInstanceFormFooter>
          <DeployInstanceSubmitButton />
          <DeployInstanceFormNote />
        </DeployInstanceFormFooter>
      </DeployInstanceForm>
    </Card>
  );
};
