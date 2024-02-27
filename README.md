# Calenthor Library

[![npm dm](https://img.shields.io/npm/dm/keez-invocing)](https://www.npmjs.com/package/keez-invoicing)
[![npm dt](https://img.shields.io/npm/dt/keez-invocing)](https://www.npmjs.com/package/keez-invoicing)

> ℹ️ The project uses the [TPN-Labs/keez-node](https://github.com/TPN-Labs/keez-node) as a starting point for structuring
the files and folders. Also, the base package.json is from the same repository.


### 📁 Project Structure
    .
    ├── src/
    │   └── Holds the source code of the application.
    │   ├── api/
    │   │   └── Holds the API interface files, such as the REST API controllers or service interfaces 
    │   │       that external clients interact with.
    │   ├── config/
    │   │   └── Configuration files, such as environment variables, etc.
    │   ├── domain/
    │   ├── ├── Contains the core business logic and domain models.
    │   │   ├── models/
    │   │   │   ├── Defines the entities and value objects of the domain, such as CalendarEvent and Duration.
    │   │   └── services/
    │   │       └── Contains domain services (CalendarService.ts) that contain business logic
    │   │           orchestrating domain model interactions.
    │   ├── errors/
    │   │   └── Custom error classes.
    │   ├── repositories/
    │   │   └── Abstractions over data access layers, allowing for decoupling the
    │   │       application from the data source.
    │   ├── types/
    │   │   └── The definitions of types and interfaces that are shared across the project.
    │   ├── utils/
    │   │   └── Utility functions and helpers, like date manipulation functions.
    │   └── index.ts  # The main entry point for the module, which exports the API for external use.
    ├── tests/
    │   └── Contains all the test files.
    └──────


## 📝 License

Copyright © 2024 [TPN LABS](https://tpn-labs.com) - All rights reserved. This project is [MIT](LICENSE) licensed.
