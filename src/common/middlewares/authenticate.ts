import { expressjwt as jwt } from "express-jwt";
import { Config } from "../../config/config";
import { Request } from "express";

export default jwt({
  secret: Config.ACCESS_TOKEN_SECRET,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    type AuthCookie = {
      AccessToken: string;
    };
    const { AccessToken } = req.cookies as AuthCookie;
    return AccessToken;
  },
});
