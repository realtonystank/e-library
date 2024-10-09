import { expressjwt as jwt, Request } from "express-jwt";
import { Config } from "../../config/config";
import { AppDataSource } from "../../config/data-source";
import { Refresh_Tokens } from "../../entity/Refresh_Tokens";

type AuthToken = {
  RefreshToken: string;
};

export default jwt({
  secret: Config.REFRESH_TOKEN_SECRET,
  algorithms: ["HS256"],
  getToken: (req: Request) => {
    const { RefreshToken } = req.cookies as AuthToken;

    return RefreshToken;
  },
  isRevoked: async (req: Request) => {
    const refreshTokenRepository = AppDataSource.getRepository(Refresh_Tokens);

    const { RefreshToken } = req.cookies as AuthToken;

    const tokenInDb = await refreshTokenRepository.findOneBy({
      token: RefreshToken,
    });

    return tokenInDb !== null;
  },
});
