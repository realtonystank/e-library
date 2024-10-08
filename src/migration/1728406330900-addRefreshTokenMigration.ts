import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenMigration1728406330900
  implements MigrationInterface
{
  name = "AddRefreshTokenMigration1728406330900";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refreshTokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "token" varchar, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_refreshTokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "token" varchar, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer, CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_refreshTokens"("id", "token", "expiresAt", "createdAt", "userId") SELECT "id", "token", "expiresAt", "createdAt", "userId" FROM "refreshTokens"`,
    );
    await queryRunner.query(`DROP TABLE "refreshTokens"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_refreshTokens" RENAME TO "refreshTokens"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" RENAME TO "temporary_refreshTokens"`,
    );
    await queryRunner.query(
      `CREATE TABLE "refreshTokens" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "token" varchar, "expiresAt" datetime NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "refreshTokens"("id", "token", "expiresAt", "createdAt", "userId") SELECT "id", "token", "expiresAt", "createdAt", "userId" FROM "temporary_refreshTokens"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_refreshTokens"`);
    await queryRunner.query(`DROP TABLE "refreshTokens"`);
  }
}
