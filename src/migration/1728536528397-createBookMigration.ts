import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookMigration1728536528397 implements MigrationInterface {
  name = "CreateBookMigration1728536528397";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "coverImage" varchar NOT NULL, "file" varchar NOT NULL, "genre" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "book_authors_user" ("bookId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY ("bookId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7775ae6ef3e1a4e3c1e391e795" ON "book_authors_user" ("bookId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bce11c9e74388ee6e509a8411a" ON "book_authors_user" ("userId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_7775ae6ef3e1a4e3c1e391e795"`);
    await queryRunner.query(`DROP INDEX "IDX_bce11c9e74388ee6e509a8411a"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_book_authors_user" ("bookId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "FK_7775ae6ef3e1a4e3c1e391e7959" FOREIGN KEY ("bookId") REFERENCES "book" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_bce11c9e74388ee6e509a8411a7" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("bookId", "userId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_book_authors_user"("bookId", "userId") SELECT "bookId", "userId" FROM "book_authors_user"`,
    );
    await queryRunner.query(`DROP TABLE "book_authors_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_book_authors_user" RENAME TO "book_authors_user"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7775ae6ef3e1a4e3c1e391e795" ON "book_authors_user" ("bookId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bce11c9e74388ee6e509a8411a" ON "book_authors_user" ("userId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_bce11c9e74388ee6e509a8411a"`);
    await queryRunner.query(`DROP INDEX "IDX_7775ae6ef3e1a4e3c1e391e795"`);
    await queryRunner.query(
      `ALTER TABLE "book_authors_user" RENAME TO "temporary_book_authors_user"`,
    );
    await queryRunner.query(
      `CREATE TABLE "book_authors_user" ("bookId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY ("bookId", "userId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "book_authors_user"("bookId", "userId") SELECT "bookId", "userId" FROM "temporary_book_authors_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_book_authors_user"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_bce11c9e74388ee6e509a8411a" ON "book_authors_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7775ae6ef3e1a4e3c1e391e795" ON "book_authors_user" ("bookId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_bce11c9e74388ee6e509a8411a"`);
    await queryRunner.query(`DROP INDEX "IDX_7775ae6ef3e1a4e3c1e391e795"`);
    await queryRunner.query(`DROP TABLE "book_authors_user"`);
    await queryRunner.query(`DROP TABLE "book"`);
  }
}
