# FBLA-Intro-Programming | The Grand Adventure
Our project for FBLA's Introduction to Programming: **The Grand Adventure**

## Roles
| Name             | Role              |
|------------------|-------------------|
| Nikhil Pellakuru | Lead Developer    |
| Ishaan Garg      | Presentation Lead |

Every member of the group still worked on each component, but since some people were more experienced than others at specific tasks, they led the section and managed it.

## How The Grand Adventure Works
1. Users begin their journey by loading into [our webpage](https://the-grand-adventure.vercel.app), which you can also see in our repository information. BUT A WARNING: Our published site is not completely ready for use yet as we haven't implemented reponsive design YET. In the future, this is our top priority before getting our game out to the world.

2. Once the users have loaded in, they enter a username, which will be flagged if it's already taken or is blank, and they press the play button. They also have the option to click on the How to Play button for instructions on how to progress through the game.

3. Once the user presses play, they will be navigated to another page where they can see the dialouge from characters on one side, the options to select right below, and an image that will show a little bit of wats happening in the dialouge.

4. The user can select from two otions, each leading to another path of the story, with the end goal being to get the **GEM**. Sometimes, an option can lead to a death, where the user will recieve a countdown popup and the option to respawn once it ends.

5. When the user reaches a certain location in the story, a checkpoint is set for them, and if they die after that but before reaching the end, they will respawn at the checkpoint. Otherwise they respawn at the start of the story.

6. At the end of the story, the user is able to update their username, with the same validation, change the color of their username text, and view their stats (time, deaths, etc.)

Throughout the story, a stopwatch will be running to measure the time it takes for a user to complete the story. With this time, they can possibly make it onto our global leaderboard which is stored in our supabase database. If they do that, their username, username color choice, and time are shown. This leaderboard is top 10.

On every browser, a local best time is stored using cookies. This way, the user can see if they have beaten their best score and they can set a goal for themselves to beat.

The stopwatch can be paused at anytime if the user needs to do something. And while it's paused, the options are blurred as looking at them without a running stopwatch is cheating in our game.

## Key Features

- Respawn at beginning or checkpoint.
- Stopwatch to measure run times.
- Customizable username after winning.
- Top 10 Global Leaderboard.
- Best time local to browser using Cookies.

## Challenges During the Development Process

The biggest challenge while we were developing the app was teaching each other along the way. While Ishaan was able to create presentations and talk freely, he didn't have much prior experience with coding, expecially a tech stack like ours. Vice versa with Nikhil, he has experience in coding but not much in presenting or talking.

Because of this, Nikhil had to teach Ishaan the basics of ReactJS and TailwindCSS along the way and Ishaan had to help Nikhil smoothen his presentation skills and be more confident. This mutual relationship helped us finish the game and understand it as a group.

## Libraries/Frameworks Used

We used a variety of tools in our application that makes it better.

**Frontend Development**

- **ReactJS**: Javascript framework that allows for fast rendering and up to date components.
- **React Icons**: Library for ReactJS providing hundereds of SVG icons for use in our project.
- **Framer Motion**: Allows us to create smooth animations on elements.
- **React Router**: Allows us to create routes and a navigable game on the web.
- **JS Cookie**: Javascript library to handle creating, updating, getting, and deleting cookies from the page.
- **React Toastify**: Javascript library for react that helps us create popout notifications that are already styled.

**Styling**

- **TailwindCSS**: Lets us rapidly add styles to our application using predifined utility classes, reducing the amount of CSS that is loaded in our app.
- **DaisyUI**: TailwindCSS plugin providing prestyled components that can be customized using tailwindcss to our liking.

**Backend Development**

- **Supabase**: A Backend-as-a-Service that provides databases, authentication, file storage, and much more. We specifically use databases in our project to store our story and the scores of players around the world. Open source Firebase alternative.

## Hosting

Our game is hosted on the web like I previously mentioned. We do this through [Vercel](https://vercel.com/), which makes it easy to deploy projects online. We were able to connect our GitHub repository and Vercel got the code ready for publishing. It also allowed us to paste any `.env` files we had. We use ours for storing our Supabase keys, but it's hidden on our GitHub. Vercel makes it easy to deploy.
