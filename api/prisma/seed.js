import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()

;(async () => {
  const user = await prisma.users.create({
    data: {
      email: "johndoe@gmail.com",
      displayName: "John Doe",
      password: "$2b$10$peYwQQPrunjipDOVOy.p9eRN.VNF9uSI2S.5mJm2V4mzRRwviczFy",
      role: "ADMIN",
      profilePictureUrl: 'https://avatars.githubusercontent.com/u/76908036?v=4'
    },
  })

  console.log("User created: ", user)

  const serviceOrders = await prisma.serviceOrders.createMany({
    data: [
      {
        date: new Date('2025-06-01'),
        description: 'Verificação de rotina do sistema elétrico',
        status: 'pending',
        type: 'scheduled',
        userId: user.id,
        index: 1000,
      },
      {
        date: new Date('2025-06-03'),
        description: 'Correção de vazamento hidráulico no setor B',
        status: 'in_progress',
        type: 'scheduled',
        userId: user.id,
        index: 2000,
      },
      {
        date: new Date('2025-06-05'),
        description: 'Inspeção de segurança preventiva',
        status: 'done',
        type: 'corrective',
        userId: user.id,
        index: 3000,
      },
      {
        date: new Date('2025-06-08'),
        description: 'Reparo em sistema de climatização',
        status: 'pending',
        type: 'corrective',
        userId: user.id,
        index: 3000,
      },
    ]
  })

  console.log("Service Orders created: ", serviceOrders)

})()
.catch(console.error)
