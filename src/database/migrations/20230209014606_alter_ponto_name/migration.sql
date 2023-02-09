/*
  Warnings:

  - You are about to drop the `Alocacoes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Batidas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Alocacoes";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Batidas";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Alocacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeProjeto" TEXT NOT NULL,
    "dia" DATETIME NOT NULL,
    "tempo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BatidaPonto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dia" DATETIME NOT NULL,
    "horario" TEXT NOT NULL
);
