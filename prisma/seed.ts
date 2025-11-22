import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const members = [
    { firstName: "JesLord", lastName: "K. Kwarteng", phone: "0548444631", role: "PASTOR" },

    { firstName: "Eugene", lastName: "F. Yao Dushie", phone: "0595744536", role: "LEADER" },
    { firstName: "Evelyn", lastName: "Dede Teye", phone: "0549640540", role: "LEADER" },
    { firstName: "Desmond", lastName: "Kudjuh", phone: "0594324150", role: "LEADER" },
    { firstName: "Godsway", lastName: "Adzah", phone: "0548923024", role: "LEADER" },
    { firstName: "John", lastName: "Azilah", phone: "0596564740", role: "LEADER" },
    { firstName: "Livingstone", lastName: "Yao Amenuku", phone: "0552452331", role: "LEADER" },
    { firstName: "Prince Charles", lastName: "Nuwordu", phone: "0550446762", role: "LEADER" },
    { firstName: "Desmond", lastName: "Kudjuh", phone: "0594234150", role: "LEADER" },
    { firstName: "Roger", lastName: "Nadugbey", phone: "0549588333", role: "LEADER" },
    { firstName: "Harriet", lastName: "Azuma Dzifa", phone: "0593655839", role: "LEADER" },
    { firstName: "Emmanuella", lastName: "Amofa", phone: "0536168101", role: "LEADER" },

    { firstName: "Grace", lastName: "Akyea-Mensah", phone: "0509168950", role: "LEADER" },
    { firstName: "Dominic", lastName: "Korbe", phone: "0541056990", role: "LEADER" },

    { firstName: "Collins", lastName: "Osabutey", phone: "0541056990", role: "MEMBER" },
    { firstName: "Prosper", lastName: "Dela Segbefia", phone: "0257462404", role: "MEMBER" },
    { firstName: "Isaac", lastName: "Adjei", phone: "0550541098", role: "MEMBER" },
    { firstName: "Julius", lastName: "Oko Onyibest", phone: "0556062726", role: "MEMBER" },
    { firstName: "Delight", lastName: "Kekeli Dziwornu", phone: "0534574642", role: "MEMBER" },
    { firstName: "Justice", lastName: "Mortoti", phone: "0530859175", role: "MEMBER" },
    { firstName: "Bismark", lastName: "Agbebianu", phone: "0552271120", role: "MEMBER" },
    { firstName: "Cecil", lastName: "Dewodo", phone: "0537326965", role: "MEMBER" },
    { firstName: "Favour", lastName: "Ofodum", phone: "0536158443", role: "MEMBER" },
    { firstName: "Pearl", lastName: "Adzo Kanati", phone: "0539656676", role: "MEMBER" },
    { firstName: "Victoria", lastName: "Etor", phone: "0543780665", role: "MEMBER" },
    { firstName: "Augustine", lastName: "Silivi", phone: "0593909086", role: "MEMBER" },
    { firstName: "Felix", lastName: "Sena", phone: "0552529939", role: "MEMBER" },
    { firstName: "Bright", lastName: "Adzraku", phone: "0534448090", role: "MEMBER" },
    { firstName: "Kingsley", lastName: "M. Yao Okoro", phone: "0531792873", role: "MEMBER" },
    { firstName: "Michael", lastName: "W. Armstrong", phone: "0559235568", role: "MEMBER" },
    { firstName: "Derrick", lastName: "Kudjuh", phone: "0241370636", role: "MEMBER" },
    { firstName: "Richard", lastName: "Kwame Tekpa", phone: "0556480604", role: "MEMBER" },
    { firstName: "Susana", lastName: "Amoh", phone: "0546895472", role: "MEMBER" },
  ];

  await prisma.member.createMany({
    data: members,
    skipDuplicates: true,
  });

  console.log("Members seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
