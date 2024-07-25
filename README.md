# xml-json-nestjs
This project fetches XML data from external API, converts it into JSON and stores it in MongoDB.
This project is build using nestJs, express and TypeScript.


## Installation

Clone this repo

### Prerequisites

- Ensure that `make` is installed on your system.
- Ensure that Docker is installed and running on your system.  

**Installation guides for `make`:**
- **Windows:** [How to setup/install GNU make on Windows](https://leangaurav.medium.com/how-to-setup-install-gnu-make-on-windows-324480f1da69)
- **Mac:** [Homebrew formula for make](https://formulae.brew.sh/formula/make)

### Steps

1. Clone this repository:

    ```bash
    git clone https://github.com/Ashish12031997/xml-json-nestjs
    cd xml-json-nextjs
    ```

2. Start the application and MongoDB container inside Docker:

    ```bash
    make up
    ```

## API Reference

```http
  Post http://localhost:3000/graphql
```

| Query | Description                |
| :-------- |  :------------------------- |
| `{"query": "{ fetchVehicles }"}` | Initiates the data collection for vehicle make and vehicle make type |
|`{"query": "{ getVehicles(page:1, limit:10) { makeId, makeName } }"}` | fetches vehicle make data |
|`{"query": "{ getVehicleInformation(makeId:12858) {makeId, makeName,vehicleTyp{makeTypeId,makeTypeName}}}"}` |fetches vehicle make data along with vehicle type data |


## Authors

- [@Ashish Patadiya](https://github.com/Ashish12031997)

