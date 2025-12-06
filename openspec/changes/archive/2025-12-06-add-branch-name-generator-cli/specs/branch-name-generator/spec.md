## ADDED Requirements

### Requirement: CLI Installation
The application SHALL be installable globally via npm using the command `npm install -g @hoge/foobar@latest`.

#### Scenario: Successful installation
- **WHEN** user runs `npm install -g @hoge/foobar@latest`
- **THEN** the CLI command `create-branch-name` (or configured command name) becomes available globally

### Requirement: Prefix Configuration
The application SHALL allow users to configure branch name prefixes (e.g., `feature/`, `hotfix/`, `topic/`) that are stored persistently.

#### Scenario: Setting a prefix
- **WHEN** user runs the command with prefix configuration option (e.g., `create-branch-name --set-prefix feature/`)
- **THEN** the prefix is saved to a configuration file in the user's home directory

#### Scenario: Using configured prefix
- **WHEN** user runs the branch name generation command
- **THEN** the configured prefix is automatically prepended to the generated branch name

### Requirement: Interactive Feature Description Input
The application SHALL prompt the user to enter a text description of the feature they want to develop.

#### Scenario: Prompting for feature description
- **WHEN** user runs the branch name generation command
- **THEN** the application displays a prompt asking for the feature description
- **AND** the user can enter text describing the feature

### Requirement: LLM API Integration
The application SHALL send the user's feature description to the ChatGPT API and receive branch name suggestions.

#### Scenario: Successful API call
- **WHEN** user provides a feature description and the API key is configured
- **THEN** the application sends a request to the ChatGPT API with the feature description
- **AND** the application receives a branch name suggestion from the API

#### Scenario: API key not configured
- **WHEN** user runs the command but API key is not set
- **THEN** the application displays an error message instructing the user to configure the API key

#### Scenario: API call failure
- **WHEN** the API call fails (network error, invalid key, etc.)
- **THEN** the application displays an appropriate error message to the user

### Requirement: Branch Name Output
The application SHALL display the generated branch name(s) to the user, combining the configured prefix with the LLM-generated name.

#### Scenario: Displaying generated branch name
- **WHEN** the LLM API successfully returns a branch name suggestion
- **THEN** the application displays the branch name with the configured prefix (e.g., `feature/user-authentication`)
- **AND** the output is clearly formatted and readable

### Requirement: Configuration Management
The application SHALL store and retrieve configuration settings (prefix, API key location reference) from a persistent configuration file.

#### Scenario: Reading configuration
- **WHEN** the application starts
- **THEN** it reads the configuration file from the user's home directory
- **AND** uses the stored prefix if available

#### Scenario: Default prefix
- **WHEN** no prefix is configured
- **THEN** the application uses a default prefix (e.g., `feature/`) or prompts the user to set one
