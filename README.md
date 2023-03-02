# OrdFilter

This is a simple website that displays a collection of ordinals, along with a filter. Below is an example used with the Ordinal Fomojis collection, which is available on https://ord-filter.vercel.app, and is also used on the [Ordinal Fomojis website](https://www.fomojis.io)

On the collection page, all Ordinals are visible, and are labelled with their inscription number. The Ordinals can be filtered by trait, and as many filters as you want can be applied. Each filter can be removed one by one either by unticking it in the filter pane, or clicking the cross on the filter cards at the top. All filters can be cleared using the "Clear all" button

<img width="1552" alt="collection_preview" src="https://user-images.githubusercontent.com/125774731/221779768-8f1e52c7-e10d-4f1d-a47f-266ac4d57590.png">

Clicking on an individual Ordinal on the collection page brings up more detailed information about it, including its inscription id, all it's attributes, and a button to take you to its ordinals.com page. Also, any of the attributes can be clicked, which will take you to the collection page showing just the Ordinals with that trait

<img width="1552" alt="individual_preview" src="https://user-images.githubusercontent.com/125774731/221779715-f1cddae4-9693-4a05-ba35-2291bf53cb94.png">

The source code is free for other projects to use how they would like to. It is built with a React.js front end, with a Next.js backend

## Need help?
If you have any questions, jump into the [Fomojis Discord](https://discord.gg/mmPQF7tDQ4) and raise a ticket. I (Vannix) will try to help you out with any issues

If you discover bugs or other issues, please raise an issue in GitHub and I will try to address it as soon as possible

## Running in development

To get started, Fork this repo into your own Github account (I recommend forking it rather than duplicating the code in your own repo so you can pull updates and improvements when I add them)

Once you have forked and cloned the repo onto your computer, `cd` into `ord-filter` and execute `npm run dev`. You can then view the website on `localhost:3000`. It will update live, so when you change the code and save it, the website will automatically update to reflect the change. 

Note: performance in development is significantly worse than it will be when it is built properly, becuase it tries to download the inscription numbers from ordinals.com every time a change is made, whereas this normally only happens once when the website is built.

## Setup
The below instructions outline the minimal changes that need to be made if you want to set up this website for your collection. You can also take any parts from the source code and put them into your own website

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

### Colors
I highly encourage you to change the colors of the website to create your own theme, and to differentiate it from Ordinal Fomojis

All of the colors used throughout the website are defined in `styles/_variables.sass`. Read the associated comments in that file to understand where each color is used. If you don't understand the hex color codes in the file, there are countless tools online to generate colors, such as [this one](https://fffuel.co/cccolor/)

### Fonts
I also recommend changing the fonts to align with your brand. You will need to use a font from [Google Fonts](https://fonts.google.com/) (unless you know how to load a downloaded font into React.js)

The website has two fonts, a title font and a body font. When selecting your fonts in Google Fonts, ensure you select Regular 400 and Bold 700 weights for the body font, and a Regular 400 weight for the title font. Once you have selected your fonts, Google Fonts will give you the code needed to use it. You will get the option between `<link>` and `@import`. Select `@import`. It will give you something like this
```
<style>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Rock+Salt&display=swap');
</style>
```
Just take the middle line, and make sure to remove the semicolon at the end (this is important). So you should end up with something like
```
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&family=Rock+Salt&display=swap')
```
Replace the existing font import in `styles/globals.sass` with your font import (line 2)

Google Fonts will also give you the CSS rules to specify the font families, which will look like
```
font-family: 'Nunito', sans-serif;
font-family: 'Rock Salt', cursive;
```
In the `styles/globals.sass` file replace the font under the `p` with your body font (line 5) and replace the font under the `h1` with your title font (line 8). Again, it is important you remove the semicolons from the code Google Fonts gives you. There should not be any semicolons in `styles/globals.sass`, otherwise the website will crash

### Site map
A site map is needed for search engine optimisation. If it is not correct, you site will may appear on Google or other search engines. In `public/sitemap.xml`, change `https://fomojis.io` to your website url

### favicon
A favicon is the logo for your website and is used in various situations, most notably as the icon in the tab for your website as seen below

<img width="377" alt="Screen Shot 2023-03-01 at 10 19 29 pm" src="https://user-images.githubusercontent.com/125774731/222125154-8520eea4-6eaa-4bbf-8435-7ee944a099cd.png">

The favicon consists of 7 files, so that the icon can be displayed correctly at various different sizes
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `apple-touch-icon.png`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon.ico`
- `site.webmanifest`

All of these files need to go in the `public` folder. You can use online tools such as [favicon.io](https://favicon.io/) to generate all of these files for you

Note: favicon.io asks you to copy a bunch of tags into the head of the HTML. This is already done, you don't need to do this. All you need is the 7 files above in the `public` folder

### Title and description
You can set the title and description in `lib/config.json`.

The title is displayed in the tabs as seen below

<img width="377" alt="Screen Shot 2023-03-01 at 10 19 29 pm" src="https://user-images.githubusercontent.com/125774731/222125154-8520eea4-6eaa-4bbf-8435-7ee944a099cd.png">

And the description is displayed in social media posts such as Discord or Twitter. Below is an example from Discord

<img width="533" alt="Screen Shot 2023-03-01 at 10 22 02 pm" src="https://user-images.githubusercontent.com/125774731/222125528-e207dc53-bace-4c4b-a257-9ce3a7b24451.png">

## Hosting
If you don't already have a deployed website, you can deply this on a hosting service of you choice. Instructions for this can be found on the [Next.js docs](https://nextjs.org/docs/deployment)

I recommed hosting the website on Vercel. Vercel created Next.js, so their services are optimised for it. It is relatively cheap, and if you don't expect much traffic the free plan may be sufficient. You can also buy domain names for a decent price through Vercel. All you need to do is create a project and connect you github repo and it will deploy automatically. Click [here](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) to set it up
