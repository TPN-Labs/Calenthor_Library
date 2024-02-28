# Calenthor Library

[![npm dm](https://img.shields.io/npm/dm/keez-invocing)](https://www.npmjs.com/package/keez-invoicing)
[![npm dt](https://img.shields.io/npm/dt/keez-invocing)](https://www.npmjs.com/package/keez-invoicing)

> ℹ️ The project uses the [TPN-Labs/keez-node](https://github.com/TPN-Labs/keez-node) as a starting point for structuring
the files and folders. Also, the base package.json is from the same repository.

## 📚 Description

Calenthor is a library that provides a set of tools to manage and manipulate calendar events. It is designed to be
flexible and easy to use, allowing developers to create, update, and delete events, as well as listing them based on
an interval of time.

## 📦 Installation

```bash
npm install calenthor
```

Or using yarn:

```bash
yarn add calenthor
```

### 🧩 Example

> ℹ️ You can check the [TPN-Labs/Calenthor_Client](https://github.com/TPN-Labs/Calenthor_Client) repository as an
example of how to use the library.

## 📖 Usage

### 📅 Create an event

```typescript
import { CalenthorApi, EventItem, Duration, MILLISECONDS_IN_A_DAY } from 'calenthor-lib';

const calendar = new CalenthorApi();

const event: EventItem = {
    title: 'Meeting',
    start: new Date('2024-12-01T10:00:00'),
    duration: new Duration(MILLISECONDS_IN_A_DAY),
};

calendar.createEvent(event);

calendar.listEvents({
    start: new Date('2024-12-01T00:00:00'),
    end: new Date('2024-12-02T00:00:00'),
});
```

### 📅 Create a recurring event

```typescript
const event: EventItem = {
    title: 'Recurring Meeting',
    start: new Date('2024-12-01T10:00:00'),
    duration: new Duration(MILLISECONDS_IN_A_DAY),
    recurrenceRule: {
        frequency: RecurrenceFrequency.DAILY,
        interval: 1,
        count: null,
        endDate: null,
    },
};

calendar.createEvent(event);

calendar.listEvents({
    start: new Date('2024-12-01T00:00:00'),
    end: new Date('2024-12-06T00:00:00'),
});
```


### 📁 Project Structure
    .
    ├── src/
    │   └── Holds the source code of the application.
    │   ├── api/
    │   │   └── Holds the API interface files, such as the REST API controllers or service 
    │   │       interfaces that external clients interact with.
    │   ├── config/
    │   │   └── Configuration files, such as environment variables, etc.
    │   ├── domain/
    │   │   ├── Contains the core business logic and domain models.
    │   │   ├── models/
    │   │   │   └── Defines the entities and value objects of the domain, such
    │   │   │       as the Calendar, Event, etc.
    │   │   └── services/
    │   │       └── Contains domain services (CalendarService.ts) that contain business
    │   │            logic orchestrating domain model interactions.
    │   ├── errors/
    │   │   └── Custom error classes.
    │   ├── repositories/
    │   │   └── Abstractions over data access layers, allowing for decoupling the
    │   │       application from the data source.
    │   ├── types/
    │   │   └── The definitions of types and interfaces that are shared across the project.
    │   ├── utils/
    │   │   └── Utility functions and helpers, like date manipulation functions.
    │   └── index.ts   The main entry point for the module, which
    │                  exports the public API of the library.
    ├── tests/
    │   └── Contains all the test files.
    └──────

### 🚀 CI/CD

The project uses GitHub Actions for CI/CD. The workflow is defined in the `.github/workflows` folder.

The workflow executed when a pull request is opened or updated are:
- `build.yml`: It installs the dependencies and builds the project for the Node.js `18.x` and `20.x` versions using 
the `ubuntu-latest` and `macos-latest` operating systems. 
- `SonarQube`: It runs the SonarQube analysis and sends the report to the SonarQube server
- `lint.yml`: It runs the linter and checks for code style issues
- `test.yml`: It runs the tests and generates the coverage report as PR comment

## 📝 License

Copyright © 2024 [TPN LABS](https://tpn-labs.com) - All rights reserved. This project is [MIT](LICENSE) licensed.
