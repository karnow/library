const { gql } = require("apollo-server");

const typeDefs = gql`
type Query {
    "A simple greeting"
    greeting: String!,
    "It might greet you. Or... It might not.."
    schroedingersCatGreeting: String,
    "Do not feel obliged to click on them. Although they rae interesting"
    intereStringUrls: [String!]!,
    "Result of a 6-side dice throw. Returns a random number between 1 and 6"
    randomDiceThrow: Int!,
    "a pi constans"
    pi: Float!,
    "An answer to a important question. Especially when you are at the office few days after monday"
    isTodayFriday: Boolean!,
    "When you really need to succed"
    randomCoinTossesUntilTrue: [Boolean!]!,
    "It tells you what day is it now"
    today: DayOfWeek!,
    "Consecutive list of days when most of us need to work"
    workDays: [DayOfWeek!]!,
    "A random quote to inspire or cheer you up"
    randomQuote:Quote,
    randomQuote2:[Quote]
}
"""
# The object represeting a quote
## It contains a text and author's name

"""
type Quote {
    text: String!,
    author: String!
}

enum DayOfWeek {
    MON
    TUE
    WED
    THU
    SAT
    FRI 
    SUN
}


`;

module.exports = typeDefs;
