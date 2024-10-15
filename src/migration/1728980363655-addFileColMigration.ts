import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileColMigration1728980363655 implements MigrationInterface {
  name = "AddFileColMigration1728980363655";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "book_author_user" ("bookId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY ("bookId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85112a398320ab4f57e823d662" ON "book_author_user" ("bookId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8f5be83ad133cc6873ffefac1" ON "book_author_user" ("userId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_85112a398320ab4f57e823d662"`);
    await queryRunner.query(`DROP INDEX "IDX_c8f5be83ad133cc6873ffefac1"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_book_author_user" ("bookId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "FK_85112a398320ab4f57e823d662c" FOREIGN KEY ("bookId") REFERENCES "book" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_c8f5be83ad133cc6873ffefac18" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("bookId", "userId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_book_author_user"("bookId", "userId") SELECT "bookId", "userId" FROM "book_author_user"`,
    );
    await queryRunner.query(`DROP TABLE "book_author_user"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_book_author_user" RENAME TO "book_author_user"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85112a398320ab4f57e823d662" ON "book_author_user" ("bookId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c8f5be83ad133cc6873ffefac1" ON "book_author_user" ("userId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_c8f5be83ad133cc6873ffefac1"`);
    await queryRunner.query(`DROP INDEX "IDX_85112a398320ab4f57e823d662"`);
    await queryRunner.query(
      `ALTER TABLE "book_author_user" RENAME TO "temporary_book_author_user"`,
    );
    await queryRunner.query(
      `CREATE TABLE "book_author_user" ("bookId" integer NOT NULL, "userId" integer NOT NULL, PRIMARY KEY ("bookId", "userId"))`,
    );
    await queryRunner.query(
      `INSERT INTO "book_author_user"("bookId", "userId") SELECT "bookId", "userId" FROM "temporary_book_author_user"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_book_author_user"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_c8f5be83ad133cc6873ffefac1" ON "book_author_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85112a398320ab4f57e823d662" ON "book_author_user" ("bookId") `,
    );
    await queryRunner.query(`DROP INDEX "IDX_c8f5be83ad133cc6873ffefac1"`);
    await queryRunner.query(`DROP INDEX "IDX_85112a398320ab4f57e823d662"`);
    await queryRunner.query(`DROP TABLE "book_author_user"`);
  }
}
