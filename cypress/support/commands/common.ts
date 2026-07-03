import { USER_LOCALSTORAGE_KEY } from '../../../src/shared/const/localstorage';
import {selectByTestId} from "../../helpers/selectByTestId";

const apiUrl = () => Cypress.env('API_URL') as string;

export const login = (username: string = 'admin2', password: string = 'helloween') => {
    return cy.request({
        method: 'POST',
        url: `${apiUrl()}/auth/login`,
        body: {
            username,
            password,
        },
    }).then(({ body }) => {
        window.localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(body));
        return body
    });
};

export const getByTestId = (testId: string) => {
    return cy.get(selectByTestId(testId))
}

declare global {
    namespace Cypress {
        interface Chainable {
            login(email?: string, password?: string): Chainable<void>
            getByTestId(testId: string): Chainable<JQuery<HTMLElementTagNameMap>>
        }
    }
}
