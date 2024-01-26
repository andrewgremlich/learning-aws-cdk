import { Stack, StackProps } from "aws-cdk-lib"
import { AttributeType, Table as DynamoTable, ITable, Table } from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"
import { getSuffixFromStack } from "../Utils";

export class DataStack extends Stack {
  public readonly spacesTable: ITable;
  public readonly continentIndex: string = 'continent-index';

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    // this.spacesTable = new DynamoTable(this, 'SpacesTable', {
    //   partitionKey: {
    //     name: 'id',
    //     type: AttributeType.STRING
    //   },
    //   sortKey: {
    //     name: 'continent',
    //     type: AttributeType.STRING
    //   },
    //   tableName: `SpacesTable-${suffix}`
    // })

    const table = new Table(this, 'SpacesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'continent',
        type: AttributeType.STRING
      },
      tableName: `SpacesTable-${suffix}`
    })

    table.addGlobalSecondaryIndex({
      indexName: this.continentIndex,
      partitionKey: {
        name: 'continent',
        type: AttributeType.STRING
      }
    });

    this.continentIndex = this.continentIndex;
    this.spacesTable = table;
  }
}