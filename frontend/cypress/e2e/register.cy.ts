describe('Login Page Tests', () => {
  beforeEach(() => {
    // Visit the page before each test
    cy.visit('https://localhost:4200/login')
  })

  it('should display the login form', () => {
    // Check if the login container exists
    cy.get('.loginContainer').should('exist')
  })

  it('allows a user to enter a username and password', () => {
    // Type into the username and password fields
    cy.get('.loginContainer .username').type('testuser')
    cy.get('.loginContainer .password').type('password')
    
    // You can add a check for the 'Log in' button if necessary
    cy.get('.loginContainer .submit').should('exist')
  })

  it('should display an error message for invalid credentials', () => {
    // Type into the username and password fields with invalid credentials
    cy.get('.loginContainer .username').type('wronguser')
    cy.get('.loginContainer .password').type('wrongpassword')
    
    // Click the 'Log in' button
    cy.get('.loginContainer .submit').click()

    // Check for the error message
    cy.get('.loginContainer .error').should('exist')
  })

  it('should allow a user to navigate to the sign up page', () => {
    // Click on the 'Sign Up' link
    cy.get('.signUp').click()

    // Check if the sign up form is now displayed
    cy.get('.loginContainer h1').contains('Sign up').should('exist')
  })

  // Add more tests as needed for sign up, checkbox behavior, etc.
})
