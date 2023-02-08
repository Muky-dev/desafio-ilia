-- CreateTable
CREATE TABLE "Alocacoes" (
    "id" SERIAL NOT NULL,
    "nomeProjeto" VARCHAR(255) NOT NULL,
    "dia" DATE NOT NULL,
    "tempo" VARCHAR(255) NOT NULL,

    CONSTRAINT "Alocacoes_pkey" PRIMARY KEY ("id")
);
