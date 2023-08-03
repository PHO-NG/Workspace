## BUTTON COMPONENT
`npm i class-variance-authority`
Define variance of an element

`npm i lucide.react`
icon library for React

`npm i clsx`
conditional classNames

`npm i tailwind-merge`
merge redundant tailwind classNames => cleaner code

`export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {isLoading?: boolean}`
- `export interface ButtonProps` An interface (ButtonProps) used to call the properties we receive and what we can parse to it
- `ButtonHTMLAttributes<HTMLButtonElement>` The props we can parse to the button component is going to include whatever we can parse to a default HTML button 
    e.g. `<Button onClick={} />`
- `VariantProps<typeof buttonVariants>` allow us to use the variants of buttonVariants we created beforehand e.g. `<Button size='default />'`
- `isLoading?: boolean` a custom property we can parse.

## DATABASE
`npm i @upstash/redis`
To use the redis database from upstash

## AUTH
`npm i --save next-auth` 
nextjs authentication

`npm i @next-auth/upstash-redis-adapter` 
next auth redis adapter: used to put user data will be put into the database automatically

`session: {strategy: 'jwt',}`
JSON web tokens: we dont handle the session on the dataase so we can verify the session in middleware to protect our routes

## FORMS
`npm i react-hook-form @hookform/resolvers zod axios`
- `react-hook-forms` library to handle forms easier
- `@hookform/resolvers`
- `zod` Find schemas to validate user inputs. 
- `axios` to make the fetch request
