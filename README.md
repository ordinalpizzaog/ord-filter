# OrdFilter

This is a simple website that displays a collection of ordinals, along with a filter. Below is an example used with the Ordinal Fomojis collection, which is available on https://ord-filter.vercel.app/, and is also used on the (Ordinal Fomojis website)[https://www.fomojis.io]

On the collection page, all Ordinals are visible, and are labelled with their inscription number. The Ordinals can be filtered by trait, and as many filters as you want can be applied. Each filter can be removed one by one either by unticking it in the filter pane, or clicking the cross on the filter cards at the top. All filters can be cleared using the "Clear all" button
<img width="1552" alt="collection_preview" src="https://user-images.githubusercontent.com/125774731/221779768-8f1e52c7-e10d-4f1d-a47f-266ac4d57590.png">
Clicking on an individual Ordinal on the collection page brings up more detailed information about it, including its inscription id, all it's attributes, and a button to take you to its ordinals.com page. Also, any of the attributes can be clicked, which will take you to the collection page showing just the Ordinals with that trait
<img width="1552" alt="individual_preview" src="https://user-images.githubusercontent.com/125774731/221779715-f1cddae4-9693-4a05-ba35-2291bf53cb94.png">
Note about terminology: throughout this repo, I use the word trait and attribute interchangeably. I also use property and trait type interchangeably. In the example above, we have a Lavender background. Here, Lavender is the trait or attribute, while the property or trait type is Background

This repo is available for other Ordinals projects to use. You can either use it as is, or you can integrate it into an existing website and add new features to it. It is built with a React.js front end, with a Next.js backend

## Need help?
I have tried to make these instructions accessible to people without web development experience (but you will need to know how to use git). If you are having trouble, jump into the [Fomojis Discord](https://discord.gg/mmPQF7tDQ4) and raise a ticket. I (Vannix) will try to help you out with any issues setting this up

## Running in development

To get started, Fork this repo into your own Github account (I recommend forking it rather than duplicating the code in your own repo so you can pull updates and improvements when I add them)

Once you have forked and cloned the repo onto your computer, `cd` into `ord-filter` and execute `npm run dev`. You can then view the website on `localhost:3000`. It will update live, so when you change the code and save it, the website will automatically update to reflect the change

## Setup

### inscriptions.json
The `lib/inscriptions.json` file contains all the metadata about your Ordinals, such as the inscription ids and the traits. You will need to replace the existing file with your metadata. It has the following structure
```
[
  {
    "id": ...,
    "meta": {
      "attributes": [
        {
          "trait_type": ...,
          "value":      ...,
          "percent":    ...
        },
        {
          "trait_type": ...,
          "value":      ...,
          "percent":    ...
        },
        ...
      ]
    }
  },
  ...
]
```
It is not an issue if there are additional properties, as they will be ignored. For example, if you have created an `inscriptions.json` file for [Ordinals Wallet](https://github.com/ordinals-wallet/ordinals-collections), then that will work without any changes. Checkout `lib/inscriptions.json` for a full example



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
