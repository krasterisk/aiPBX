import {Manual} from "../../../src/entities/Manual";

const defaultManual = {
    "title": "ТЕСТОВАЯ НОВАЯ СТАТЬЯ",
    "subtitle": "manual for testing",
    "image": "https://krasterisk.ru/logos/logo.svg",
    "views": 440,
    "userId": 1,
    "hashtags": ["INBOUND_CALL_CENTER", "IT"],
    "blocks": [
        {
            "type": "TEXT",
            "title": "Заголовок этого блока",
            "paragraphs": [
                "Программа, которую по традиции называют «Hello, world!», очень проста. Она выводит куда-либо фразу «Hello, world!», или другую подобную, средствами некоего языка.",
                "Программа2, которую по традиции называют «Hello, world!», очень проста. Она выводит куда-либо фразу «Hello, world!», или другую подобную, средствами некоего языка."
            ]
        },
        {
            "type": "CODE",
            "code": "<!DOCTYPE html>\n<html>\n  <body>\n    <p id=\"hello\"></p>\n\n    <script>\n      document.getElementById(\"hello\").innerHTML = \"Hello, world!\";\n    </script>\n  </body>\n</html>;"
        },
        {
            "type": "CODE",
            "code": "2<!DOCTYPE html>\n<html>\n  <body>\n    <p id=\"hello\"></p>\n\n    <script>\n      document.getElementById(\"hello\").innerHTML = \"Hello, world!\";\n    </script>\n  </body>\n</html>;"
        },
        {
            "type": "IMAGE",
            "title": "super image",
            "src": "https://krasterisk.ru/logos/logo.svg"
        },
        {
            "type": "TEXT",
            "title": "Заголовок второго блока",
            "paragraphs": [
                "Программа4, которую по традиции называют «Hello, world!», очень проста. Она выводит куда-либо фразу «Hello, world!», или другую подобную, средствами некоего языка.",
                "Программа5, которую по традиции называют «Hello, world!», очень проста. Она выводит куда-либо фразу «Hello, world!», или другую подобную, средствами некоего языка."
            ]
        }
    ]
}

export const createManual = (manual?: Manual) => {
    const apiUrl = Cypress.env('API_URL') as string;
    return cy.request({
        method: 'POST',
        url: `${apiUrl}/manuals`,
        body: defaultManual ?? manual
    }).then((resp) => resp.body)
}

export const removeManual = (manualId: string) => {
    const apiUrl = Cypress.env('API_URL') as string;
    cy.log(manualId)
    return cy.request({
        method: 'DELETE',
        url: `${apiUrl}/manuals`,
        body: {
            ids: manualId
        }
    })
}

export const manualSearch = (filter: string) => {
    cy.getByTestId('ManualSearch').clear().type(filter)
}

export const manualSearchClear = () => {
    cy.getByTestId('ManualSearch').clear()
}

export const addComment = (text: string) => {
    cy.getByTestId('AddCommentForm.Input').type(text)
    cy.getByTestId('AddCommentForm.Button').click()
}


declare global {
    namespace Cypress {
        interface Chainable {
            createManual(manual?: Manual): Chainable<Manual>
            removeManual(manualId: string): Chainable<void>
            manualSearch(filter: string): Chainable<void>
            manualSearchClear(): Chainable<void>
            addComment(text: string): Chainable<void>
        }
    }
}
