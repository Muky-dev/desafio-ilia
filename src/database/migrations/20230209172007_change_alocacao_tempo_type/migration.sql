/*
  Warnings:

  - You are about to alter the column `tempo` on the `Alocacao` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alocacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeProjeto" TEXT NOT NULL,
    "dia" DATETIME NOT NULL,
    "tempo" INTEGER NOT NULL
);
INSERT INTO "new_Alocacao" ("dia", "id", "nomeProjeto", "tempo") SELECT "dia", "id", "nomeProjeto", "tempo" FROM "Alocacao";
DROP TABLE "Alocacao";
ALTER TABLE "new_Alocacao" RENAME TO "Alocacao";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
