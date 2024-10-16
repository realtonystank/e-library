import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedByInBookMigration1729105311443
  implements MigrationInterface
{
  name = "CreatedByInBookMigration1729105311443";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "coverImage" varchar NOT NULL, "file" varchar NOT NULL, "genre" varchar NOT NULL, "author" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_Book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "coverImage" varchar NOT NULL, "file" varchar NOT NULL, "genre" varchar NOT NULL, "author" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" integer, CONSTRAINT "FK_9ecb3e9b9624957a6b25c82606a" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_Book"("id", "title", "coverImage", "file", "genre", "author", "createdAt", "updatedAt", "createdById") SELECT "id", "title", "coverImage", "file", "genre", "author", "createdAt", "updatedAt", "createdById" FROM "Book"`,
    );
    await queryRunner.query(`DROP TABLE "Book"`);
    await queryRunner.query(`ALTER TABLE "temporary_Book" RENAME TO "Book"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Book" RENAME TO "temporary_Book"`);
    await queryRunner.query(
      `CREATE TABLE "Book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "coverImage" varchar NOT NULL, "file" varchar NOT NULL, "genre" varchar NOT NULL, "author" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "Book"("id", "title", "coverImage", "file", "genre", "author", "createdAt", "updatedAt", "createdById") SELECT "id", "title", "coverImage", "file", "genre", "author", "createdAt", "updatedAt", "createdById" FROM "temporary_Book"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_Book"`);
    await queryRunner.query(`DROP TABLE "Book"`);
  }
}
