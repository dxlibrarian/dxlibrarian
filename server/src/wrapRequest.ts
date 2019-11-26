import iconv from 'iconv-lite'

import {jwtCookie} from './jwtCookie'

function convertCodepage(content:string, fromEncoding:string, toEncoding:string) {
  return iconv.decode(iconv.encode(content, fromEncoding), toEncoding)
}

export function wrapRequest(req: any) {
  let bodyContent = null

  if (req.body == null || req.headers['content-type'] == null) {
    bodyContent = req.body
  } else {

    const [bodyContentType, ...bodyOptions] = req.headers['content-type']
      .toLowerCase()
      .split(';')
      .map(function (value:string){ return  value.trim() })
    const bodyCharset = (
      bodyOptions.find(
        function(option:string){return  option.startsWith('charset=') }
      ) || 'charset=utf-8'
    ).substring(8)

     switch (bodyContentType) {
      case 'application/x-www-form-urlencoded': {
        bodyContent = req.body.split('&').reduce(
        function(acc:{[key:string]:any}, part:string) {
          let [key, ...value] = part.split('=').map(decodeURIComponent)
          let joinedValue = value.join('=')

          if (bodyCharset !== 'utf-8') {
            key = convertCodepage(key, 'utf-8', bodyCharset)
            joinedValue = convertCodepage(joinedValue, 'utf-8', bodyCharset)
          }

          acc[key] = joinedValue
          return acc
        }, {})

        break
      }

      case 'application/json': {
        bodyContent = req.body

        if (bodyCharset !== 'utf-8') {
          bodyContent = convertCodepage(bodyContent, 'utf-8', bodyCharset)
        }

        bodyContent = JSON.parse(bodyContent)
        break
      }

      default: {
        throw new Error(`Invalid request body Content-type: ${bodyContentType}`)
      }
    }
  }

  let jwtToken = req.cookies[jwtCookie.name];

  if (req.headers && req.headers.authorization) {
    jwtToken = req.headers.authorization.replace(/^Bearer /i, '');
  }

  return Object.create(req, {
    body: {
      value: bodyContent,
      enumerable: true
    },
    path: {
      get() {
        return req.path.replace(/^\/DXLibrarian/, '');
      },
      set(value: string) {
        return (req.path = value);
      },
      enumerable: true
    },
    jwtToken: {
      get() {
        return jwtToken;
      },
      set(value: string) {
        return (req.jwtToken = value);
      },
      enumerable: true
    }
  })
}
