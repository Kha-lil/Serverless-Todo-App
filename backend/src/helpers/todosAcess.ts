import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

//const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    //private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndexTable = process.env.TODOS_CREATED_AT_INDEX
    ) {
  }


  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info(`Getting todos for user ${userId}`)

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosIndexTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }


  async createTodoForUser(todo: TodoItem): Promise<TodoItem> {
    logger.info(`Creating todo for user ${todo.userId}`)

    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()
    return todo as TodoItem
  }

  
  async updateTodoForUser(todoId: string, updatedTodo:UpdateTodoRequest, userId:string): Promise<TodoUpdate> {
    logger.info(`Updating todo ${todoId} for user ${userId} with ${updatedTodo}`)

    const result = await this.docClient.update({
      TableName: this.todosTable,
      Key: {
        "todoId": todoId,
        "userId": userId
      },
      UpdateExpression: "set #a = :a, #b = :b, #c = :c",
      ExpressionAttributeNames: {
          "#a": "name",
          "#b": "dueDate",
          "#c": "done"
      },
      ExpressionAttributeValues: {
          ":a": updatedTodo['name'],
          ":b": updatedTodo['dueDate'],
          ":c": updatedTodo['done']
      },
      ReturnValues: "ALL_NEW"

    }).promise()

    console.log(result);
    console.log(result.Attributes);
    const attributes = result.Attributes;

    return attributes as TodoUpdate;
  }

  async deleteTodoForUser(userId: string, todoId: string): Promise<string> {
    logger.info(`Deleting todo ${todoId} for user ${userId}`)
    const result = await this.docClient.delete({
      TableName: this.todosTable,
      Key: { 
        "userId": userId,
        "todoId": todoId
      }
    }).promise()

    console.log(result)
    return '' as string
  }


}


// function createDynamoDBClient() {
//   if (process.env.IS_OFFLINE) {
//     logger.info('Creating a local DynamoDB instance')
//     return new XAWS.DynamoDB.DocumentClient({
//       region: 'localhost',
//       endpoint: 'http://localhost:8000'
//     })
//   }

//   return new XAWS.DynamoDB.DocumentClient()
// }