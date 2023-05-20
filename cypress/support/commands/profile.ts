export const updateProfile = (firstname: string, lastname:string) => {
    cy.getByTestId('EditableProfileCardHeader.EditButton').click()
    cy.getByTestId('ProfileCard.Firstname').clear().type(firstname)
    cy.getByTestId('ProfileCard.Lastname').clear().type(lastname)
    cy.getByTestId('EditableProfileCardHeader.SaveButton').click()

}

export const resetProfile = (profileId: string) => {
    return cy.request({
        method: 'PUT',
        url: `http://192.168.2.37:7000/api/users/profile`,
        body: {
            id: 1,
            username: "admin2",
            firstname: "Андрей",
            lastname: "Иванов",
            age: 23,
            country: "Belarus",
            email: "admin2@krasterisk.ru",
            currency: "RUB",
            avatar: "https://krasterisk.ru/logos/adm.jpg"
        },
    })
}

declare global {
    namespace Cypress {
        interface Chainable {
            updateProfile(firstname: string, lastname: string): Chainable<void>
            resetProfile(profileId: string): Chainable<void>
        }
    }
}
