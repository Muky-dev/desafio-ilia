-- CreateTable
CREATE TABLE "Batidas" (
    "id" SERIAL NOT NULL,
    "dia" DATE NOT NULL,
    "horario" VARCHAR(255) NOT NULL,

    CONSTRAINT "Batidas_pkey" PRIMARY KEY ("id")
);
