import { IdentityVerificationService } from "../services";
import { IdentityVerificationInterface, UserWorkspaceInterface } from "../interfaces";
import { Ksuid } from "./ksuid";
import { transporter } from "./mailSender";
import { frontendBaseUrl } from "../config";

class Helper {
  static instance: Helper;
  constructor() {}

  static get(): Helper {
    if (!Helper.instance) {
      Helper.instance = new Helper();
    }
    return Helper.instance;
  }

  async sendInvitationLink({
    userWorkspace,
    email,
  }: {
    userWorkspace: UserWorkspaceInterface;
    email: string;
  }): Promise<boolean> {
    const identityVerification = await new IdentityVerificationService().create(
      {
        identity: userWorkspace.identity,
        token: Ksuid.generate(),
      }
    );

    const invitationLink = `${frontendBaseUrl}/accept-invitation?token=${identityVerification.token}`;

    await transporter.sendMail({
      to: email,
      subject: "Verification code",
      html: `
      <p>You have been invited to Teaco.</p>
      <p>Click the link below to accept the invitation:</p>
      <a href="${invitationLink}">${invitationLink}</a>
    `,
    });
    return true;
  }

  public async verifyToken(token: string): Promise<IdentityVerificationInterface> {
    const identityVerification = await new IdentityVerificationService().findOne({
      token: token,
      expiryDate: new Date(),
    });
    return identityVerification;
  }
}

const helper = Helper.get();

export { helper as Helper };
