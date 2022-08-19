import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

// TODO: Implement businessLogic

const logger = createLogger('TodosBusinessLogic')

//get todos business logic
const todoAccess = new TodosAccess()

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  try {
    logger.info(`Getting todos for user: ${userId}`)
    return todoAccess.getTodosForUser(userId)
  } catch (error) {
    logger.error(`Error message:${error}`)
  }
}


//create todo business logic
export async function createTodo(
  createTodoRequest: CreateTodoRequest, userId: string
): Promise<TodoItem> {
  const todoId = uuid.v4()
  //const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
  const done:boolean = false
  //const timestamp:string = new Date().toISOString()
  try {
    logger.info(`Creating todo for user:${userId} with todoId:${todoId} and ${createTodoRequest}`)
    return await todoAccess.createTodoForUser({
      todoId: todoId,
      userId: userId,
      name: createTodoRequest.name,
      dueDate: createTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: done
      //attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
    })
  } catch (error) {
    logger.error(`Error message:${error}
    Can't create todo for user:${userId} with todoId:${todoId} and ${createTodoRequest}`)
  }
  

  
}


//update todo business logic
export async function updateTodo(todoId, updatedTodo:UpdateTodoRequest, userId) {
  try {
    logger.info(`Updating todo:${todoId} for user:${userId} with:${updateTodo}`)
    return await todoAccess.updateTodoForUser(todoId, updatedTodo, userId)
  } catch (error) {
    logger.error(`Error message:${error},
    Can't update todo:${todoId} for user:${userId} with:${updateTodo}.`)
  }
  
}


//delete todo business logic
export async function deleteTodo(userId: string, todoId: string) {
  try {
    logger.info(`Deleting todo:${todoId} for user:${userId}`)
    return await todoAccess.deleteTodoForUser(userId, todoId)
  } catch (error) {
    logger.error(`Error:${error},
    Can't delete todo:${todoId} for user:${userId}.`)
  }
}



//getSignedUrl todo business logic
const attachmentUtils = new AttachmentUtils()


export async function createAttachmentPresignedUrl(todoId:string, userId: string) {
  try {
    logger.info(`Getting upload URL for todoId:${todoId}`)
    return await attachmentUtils.getUploadUrl(todoId, userId)
  } catch (error) {
    logger.error(`Error:${error}, Can't get upload URL for todoId:${todoId}`)
  }
}