-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Alocacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeProjeto" TEXT NOT NULL,
    "dia" TEXT NOT NULL,
    "tempo" TEXT NOT NULL
);
INSERT INTO "new_Alocacao" ("dia", "id", "nomeProjeto", "tempo") SELECT "dia", "id", "nomeProjeto", "tempo" FROM "Alocacao";
DROP TABLE "Alocacao";
ALTER TABLE "new_Alocacao" RENAME TO "Alocacao";
CREATE TABLE "new_BatidaPonto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dia" TEXT NOT NULL,
    "horario" TEXT NOT NULL
);
INSERT INTO "new_BatidaPonto" ("dia", "horario", "id") SELECT "dia", "horario", "id" FROM "BatidaPonto";
DROP TABLE "BatidaPonto";
ALTER TABLE "new_BatidaPonto" RENAME TO "BatidaPonto";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
