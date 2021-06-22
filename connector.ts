
export const convertNumber = (req: any) => {
  return Number(req)
}

export const convertContent = (content: string | undefined) => {
  const todos: string[] = []
  const item: string[] = content ? content.split(/\s/g) : []
  for (let i = 0; i < item.length; i++) {
    if (!(item) || item[i] !== '') {
      if (item) {
        todos.push(item[i])
      }
    }
  }

  return todos
}

export const errorStatus = (message?: string, code?: number) => {
  return {
    message: message || 'Forbidden',
    code: code || 403
  }
}

// const wrapper = (fn: any) => {
//   return async (req: request, res: Response) => {
//     req.prisma = prisma
//     await req.prisma.$connect()
//     await fn(req, res)
//     await req.prisma.$disconnect()
//   }
// }

// export default wrapper
