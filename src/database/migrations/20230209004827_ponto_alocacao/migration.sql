-- CreateTable
CREATE TABLE "Alocacoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeProjeto" TEXT NOT NULL,
    "dia" DATETIME NOT NULL,
    "tempo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Batidas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dia" DATETIME NOT NULL,
    "horario" TEXT NOT NULL
);
