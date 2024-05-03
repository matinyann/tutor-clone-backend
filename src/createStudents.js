const Student = require('./models/student')
const Town = require('./models/town')
const Group = require('./models/group')

const firstNames = [
    { name: 'Անի', gender: 'female' },
    { name: 'Բագրատ', gender: 'male' },
    { name: 'Դավիթ', gender: 'male' },
    { name: 'Ելիզաբեթ', gender: 'female' },
    { name: 'Իշխան', gender: 'male' },
    { name: 'Ջուլիա', gender: 'female' },
    { name: 'Կարեն', gender: 'male' },
    { name: 'Լիլիթ', gender: 'female' },
    { name: 'Մելիք', gender: 'male' },
    { name: 'Նարինե', gender: 'female' },
    { name: 'Օլգա', gender: 'female' },
    { name: 'Փարոն', gender: 'male' },
    { name: 'Քրիստինե', gender: 'female' },
    { name: 'Ռաֆայել', gender: 'male' },
    { name: 'Սարին', gender: 'male' },
    { name: 'Տաթեւիկ', gender: 'male' },
    { name: 'Ուսիկ', gender: 'female' },
    { name: 'Վահագն', gender: 'male' },
    { name: 'Վարդանուշ', gender: 'female' },
    { name: 'Տիգրան', gender: 'male' },
    { name: 'Վանե', gender: 'female' },
    { name: 'Վիկտոր', gender: 'male' },
    { name: 'Ջանա', gender: 'female' },
    { name: 'Ջոն', gender: 'male' },
    { name: 'Արամ', gender: 'male' },
    { name: 'Արթուր', gender: 'male' },
    { name: 'Աշոտ', gender: 'male' },
    { name: 'Գոհար', gender: 'male' },
    { name: 'Դիանա', gender: 'female' },
    { name: 'Լեռնաշխարհ', gender: 'female' },
    { name: 'Նելլի', gender: 'female' },
    { name: 'Հրաչ', gender: 'male' },
    { name: 'Սասուն', gender: 'female' },
    { name: 'Կոմիտաս', gender: 'male' },
    { name: 'Արսեն', gender: 'male' },
    { name: 'Բաբկեն', gender: 'male' },
    { name: 'Արաքս', gender: 'male' },
    { name: 'Նաիրա', gender: 'female' },
    { name: 'Շահեն', gender: 'male' },
    { name: 'Թիմուր', gender: 'male' },
    { name: 'Գայանե', gender: 'female' },
    { name: 'Բենիամին', gender: 'male' },
    { name: 'Դեսիթ', gender: 'male' },
    { name: 'Հայկ', gender: 'male' },
    { name: 'Ինես', gender: 'male' },
    { name: 'Կատյա', gender: 'female' },
    { name: 'Ռազմիկ', gender: 'male' },
    { name: 'Սմբատ', gender: 'male' },
    { name: 'Կարինա', gender: 'female' },
    { name: 'Մարգարիտ', gender: 'female' },
]
const middleNames = [
    "Արմեն",
    "Արթուր",
    "Վահան",
    "Արգիստոտել",
    "Արսեն",
    "Գևորգ",
    "Հակոբ",
    "Ռոբերտ",
    "Նիկոլայ",
    "Հրաչ",
    "Արամ",
    "Անդրանիկ",
    "Դավիթ",
    "Սիմոն",
    "Ալեքսանդր",
    "Հայկ",
    "Գրիգոր",
    "Սպարտակ",
    "Գարիկ",
    "Սարգիս",
    "Կոստան",
    "Էդգար",
    "Լեւոն",
    "Ռաֆայել",
    "Աշոտ",
    "Գագիկ",
    "Դեմետր",
    "Հովիկ",
    "Նարինե",
    "Կարեն",
    "Արշակ",
    "Սիհան",
    "Արման",
    "Բագրատ",
    "Արամայիս",
    "Գագիկ",
    "Արթովիկ",
    "Աշոտ",
    "Դանիել",
    "Տիգրան",
    "Գրիգոր",
    "Լինուս",
    "Մելիք",
    "Լեյոն",
    "Եղիշեյ",
    "Արա",
    "Բաբկեն",
    "Լեւոն",
    "Ադրիկ",
    "Սամվել"
]
const lastNames = [
    "Հարությունյան",
    "Մելիքյան",
    "Խաչատրյան",
    "Նազարյան",
    "Բաղդասարյան",
    "Հարությունի",
    "Գրիգորյան",
    "Հայրապետյան",
    "Կոստանյան",
    "Գուլագարյան",
    "Խոչյան",
    "Գալուստյան",
    "Միրզոյան",
    "Գալուստյան",
    "Խաչատրյան",
    "Շիրակացյան",
    "Պետրոսյան",
    "Բաղդասարյան",
    "Աբգարյան",
    "Գրիգորյան",
    "Մանուկյան",
    "Կարապետյան",
    "Կուրչյան",
    "Մարգարյան",
    "Դանիելյան",
    "Սարոյան",
    "Բաղդասարյան",
    "Դավթյան",
    "Նիկոլյան",
    "Գալուստյան",
    "Գրիգորյան",
    "Հովհաննեսյան",
    "Սարոյան",
    "Կարապետյան",
    "Դադուրյան",
    "Մանուկյան",
    "Աբգարյան",
    "Գուլագարյան",
    "Կարապետյան",
    "Ավագյան",
    "Նիկոլյան",
    "Մարգարյան",
    "Կոստանյան",
    "Գրիգորյան",
    "Գոջայան",
    "Միրզոյան",
    "Ադամյան",
    "Հովսեփյան",
    "Գանջոյան",
    "Նազարյան"
]

const createStudents = async () => {
    try {
        const selectedTowns = await Town.find().limit(10)
        const groups = await Group.find()

        const towns = selectedTowns.map(town => ({name: town.name, id: town._id}))

        let sortedByTowns = {}

        groups.forEach(async (group, groupIndex) => {
            group.students = []

            while (group.students.length <= 10) {
                for(let i = 10 * groupIndex; i < ((10 * (groupIndex + 1))); i++) {
                    const firstName = firstNames[i]
                    const middleName = middleNames[i]
                    const lastName = lastNames[i]

                    const randomTown = towns[Math.floor(Math.random() * 10)]

                    const newStudent = new Student({
                        firstName: firstName.name,
                        middleName,
                        lastName,
                        fullName: `${firstName.name} ${middleName}ի ${lastName}`,
                        email: 'student@mail.com',
                        password: 'password',
                        phoneNumbers: ['055 555555'],
                        birthday: {year: 2007, month: Math.floor(Math.random() * 11), day: Math.floor(Math.random() * 28)},
                        gender: firstName.gender,
                        avatar: firstName.gender === 'male' ? 'http://localhost:5000/api/public/avatars/male.png' : 'http://localhost:5000/api/public/avatars/female.png',
                        status: 'active',
                        town: randomTown.id,
                        currentGroup: group._id.toString(),
                        smartBasics: {
                            head: 1,
                            heart: 2,
                            hand: 1
                        }
                    })

                    if (!sortedByTowns[randomTown.name]) {
                        sortedByTowns[randomTown.name] = []
                    }

                    sortedByTowns = {
                        ...sortedByTowns,
                        [randomTown.name]: [
                            ...sortedByTowns[randomTown.name],
                            newStudent.fullName
                        ]
                    }

                    await newStudent.save()

                    group.students.push(newStudent._id)
                }


                await group.save()

                // console.log(sortedByTowns)
                break
            }
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {createStudents}