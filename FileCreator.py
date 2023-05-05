strings = [
    "regionsController.js",
    "rfidsController.js",
    "statusController.js",
    "usersController.js",
    "usersActivityHistoryController.js",
    "branchesController.js",
    "tasksController.js",
    "tasksHistoryController.js",
    "warehousesController.js",
    "branchLocationsController.js",
    "productsLocationHistoryController.js",
    "warehouseLocationsController.js",
    "movementsController.js",
    "readersController.js",
    "rfidReadingsController.js"
]

for filename in strings:
    with open(filename, "w") as file:
        pass  # No es necesario escribir contenido en el archivo, solo crearlo
