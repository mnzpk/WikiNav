# WikiNav

This [tool](https://wikinav.toolforge.org) allows users to visualize the Wikipedia [clickstream data](https://dumps.wikimedia.org/other/clickstream/readme.html).

# Data update frequency

Wikimedia's data pipelines update the [clickstream dumps](https://dumps.wikimedia.org/other/clickstream/readme.html) at the beginning of each month. Typically, the latest monthly snapshot is available on the 3rd of the next month. The WikiNav tool checks on the 12th of each month for the latest snapshot to update the underlying data. If a problem occurs with the monthly snapshot process, publication of the updated data in WikiNav may be delayed. If To report data issues with the clickstream dumps, follow [this process](https://www.mediawiki.org/wiki/Data_Platform_Engineering/Intake_Process).

## Directory Structure

    .
    ├── client                  # Tool frontend written in React
    ├── server
    |   ├── api                 # WikiNav API written in Flask
    |   └── toolforge           # ToolForge webservice written in Flask
    ├── .gitignore
    ├── LICENSE
    └── README.md

## License

The source code for WikiNav is released under the [GNU GPLv3](https://github.com/mnzpk/WikiNav/blob/main/LICENSE).

Screenshots of the charts may be used without attribution, but a link back to the application would be appreciated.
