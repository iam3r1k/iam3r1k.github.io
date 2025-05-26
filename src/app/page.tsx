"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import {list} from "postcss";

export default function Portfolio() {

  const [visits, setVisits] = useState("Loading...");
  const [ccu, setCcu] = useState("Loading...");
  const [avatarurl, setavatarturl] = useState("/file.svg");
  const [gameStats, setGameStats] = useState([{ "playing": 0, "visits": 0, "name": "Loading...", "description": "Loading...", "url": "", "img": "/file.svg" },{ "playing": 0, "visits": 0, "name": "Loading...", "description": "Loading...", "url": "", "img": "/file.svg" },{ "playing": 0, "visits": 0, "name": "Loading...", "description": "Loading...", "url": "", "img": "/file.svg" }])// Define constants for user and groups
  const userId = 1201814535;
  const games = [4506887869, 2484235486, 5890925535, 6251407341, 3914527555, 15020487147, 3914529750];


  var gameBaseUrl = '' //'roblox://placeId=' //'https://www.roblox.com/games/start?placeId='
  if (isMobile === true) {
    gameBaseUrl = 'https://www.roblox.com/games/start?placeId='
  } else {
    gameBaseUrl = 'roblox://placeId='
  }

  // Use useEffect to perform side-effects (fetching data) when the component mounts
  useEffect(() => {
    let intervalId;
    // Define asynchronous functions to fetch data from APIs
    const fetchGameData = async () => {
      const apiEndpoint = `https://games.roproxy.com/v1/games?universeIds=${games.join(',')}`;
      try {
        // Fetch game data and handle response
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Network response was not ok: ${response.status} - ${errorData.errors[0]?.message || 'Unknown error'}`);
        }
        // Return game data as JSON
        return await response.json();
      } catch (error) {
        // Log any errors
        console.error('There was a problem with the fetch operation:', error);
        return null;
      }
    };


    const getavatarturl = async () => {
      // Helper function to fetch individual group data
      const apiEndpoint = `https://thumbnails.roproxy.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=true`
      const fetchData = async () => {
        try {
          // Fetch game data and handle response
          const response = await fetch(apiEndpoint);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok: ${response.status} - ${errorData.errors[0]?.message || 'Unknown error'}`);
          }
          // Return game data as JSON
          return await response.json();
        } catch (error) {
          // Log any errors
          console.error('There was a problem with the fetch operation:', error);
          return null;
        }
      };

      try {
        // Fetch data for all groups concurrently
        const groupPromises = [fetchData()];
        return await Promise.all(groupPromises);
      } catch (error) {
        // Log any errors
        console.error('Error fetching group data:', error);
        return [];
      }
    }

    const getgameThumbnail = async (ids: any) => {
      // Helper function to fetch individual group data
      const apiEndpoint = `https://thumbnails.roproxy.com/v1/games/multiget/thumbnails?universeIds=${ids.join(',')}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`
      const fetchData = async () => {
        try {
          // Fetch game data and handle response
          const response = await fetch(apiEndpoint);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok: ${response.status} - ${errorData.errors[0]?.message || 'Unknown error'}`);
          }
          // Return game data as JSON
          return await response.json();
        } catch (error) {
          // Log any errors
          console.error('There was a problem with the fetch operation:', error);
          return null;
        }
      };

      try {
        // Fetch data for all groups concurrently
        const groupPromises = [fetchData()];
        return await Promise.all(groupPromises);
      } catch (error) {
        // Log any errors
        console.error('Error fetching group data:', error);
        return [];
      }
    }

    var totalVisits = 0
    var totalCcu = 0
    var FinalGameData = gameStats
    // Function to fetch all data once
    const fetchDataOnce = async () => {
      //try {
      // Fetch all data concurrently
      var info:any = sessionStorage.getItem("info")
      var gameData:any = {}
      var followerData:any = {}
      var groupData:any = {}
      if (info) {
        info = JSON.parse(info)
        gameData = info.gameData
        followerData = info.followerData
        groupData = info.groupData
      } else {
        [gameData] = await Promise.all([
          fetchGameData(),
        ]);
        sessionStorage.setItem("info",JSON.stringify({"gameData":gameData,"followerData":followerData,"groupData":groupData}))
      }

      if (gameData) {
        totalVisits = gameData.data.reduce((sum: any, game: any) => sum + game.visits, 0);
        totalCcu = gameData.data.reduce((sum: any, game: any) => sum + game.playing, 0);

        gameData.data.sort((a:any,b:any) => b.playing - a.playing)



      } else {
        console.log('Failed to fetch game data.');
      }



      var avatartUrl = ''


      const [avatarData,Thumnails] = await Promise.all([getavatarturl(),getgameThumbnail([gameData.data[0].id,gameData.data[1].id,gameData.data[2].id,gameData.data[3].id])])
      if (avatarData) {
        console.log(avatarData[0].data[0].imageUrl)
        avatartUrl = avatarData[0].data[0].imageUrl
      }
      FinalGameData = [
        {
          "playing": gameData.data[0].playing,
          "visits": gameData.data[0].visits,
          "name": gameData.data[0].name,
          "description": gameData.data[0].sourceDescription,
          "url": gameBaseUrl+gameData.data[0].rootPlaceId,
          "img": Thumnails[0].data[0].thumbnails[0].imageUrl
        },
        {
          "playing": gameData.data[1].playing,
          "visits": gameData.data[1].visits,
          "name": gameData.data[1].name,
          "description": gameData.data[1].sourceDescription,
          "url": gameBaseUrl+gameData.data[1].rootPlaceId,
          "img": Thumnails[0].data[1].thumbnails[0].imageUrl
        },
        {
          "playing": gameData.data[2].playing,
          "visits": gameData.data[2].visits,
          "name": gameData.data[2].name,
          "description": gameData.data[2].sourceDescription,
          "url": gameBaseUrl+gameData.data[2].rootPlaceId,
          "img": Thumnails[0].data[2].thumbnails[0].imageUrl
        },
        {
          "playing": gameData.data[3].playing,
          "visits": gameData.data[3].visits,
          "name": gameData.data[3].sourceName,
          "description": gameData.data[3].sourceDescription,
          "url": gameBaseUrl+gameData.data[3].rootPlaceId,
          "img": Thumnails[0].data[3].thumbnails[0].imageUrl
        },
      ]
      setVisits(""+totalVisits);
      setCcu(""+totalCcu);
      setGameStats(FinalGameData);
      setavatarturl(avatartUrl);
      //} catch (error) {
      // Log any errors
      // console.error('Error fetching data:', error);
      //}
    };

    // Call the function to fetch all data
    fetchDataOnce();


    intervalId = setInterval(fetchDataOnce, 600000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className=" gap-8">
        {/* Left Sidebar */}
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image src={avatarurl} alt="Profile" width={60} height={60} className="rounded-full" />
              <div>
                <h1 className="text-2xl font-mono">iam3rik</h1>
                <p className="text-gray-400">scripter/programmer</p>
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="flex gap-6">
              <button
                onClick={() => scrollToSection("projects")}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                My Projects
              </button>
              <button
                onClick={() => scrollToSection("groups")}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                My Groups
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                What I Offer
              </button>
            </nav>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div>
              <p className="text-lg font-bold text-white">{ccu}</p>
              <p className="text-gray-400 text-xs">CCU</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white">{visits}</p>
              <p className="text-gray-400 text-xs">Visits</p>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Hey there! I'm a Roblox scripter passionate about bringing virtual worlds to life. I love diving into Luau to create engaging gameplay mechanics, intuitive UIs, and robust systems. Whether it's crafting a unique game loop or optimizing performance, I'm always eager to learn and build something awesome. Let's make something cool together!
            </p>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-8">
          {/* Projects Section */}
          <div className="flex items-center justify-between"></div>
          <section id="projects" className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-mono">Games</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {  id: 0 , },
                {  id: 1 ,  },
                {  id: 2 , },
              ].map((project) => (
                <div key={project.id} className="relative aspect-[16/9] bg-gray-900 rounded-lg overflow-hidden group">
                  <Image src={gameStats[project.id].img} alt={project.id + ""} fill className="object-cover" />
                  {/* Black fade gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-end">
                    <h3 className="text-white font-medium text-sm">{gameStats[project.id].name}</h3>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 w-8 h-8" asChild>
                      <Link href={gameStats[project.id].url}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span className="sr-only">Play {gameStats[project.id].name} </span>
                      </Link>

                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Groups Section */}
          <section id="groups" className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-mono">Models</h2>
            </div>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-24 bg-white rounded-xl">
                  <img src= "/file.svg"/>
                </div>
              ))}
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-mono">What I Offer</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Backend Scripting</h3>
                  <p className="text-gray-300 text-sm">
                    Server-side development, APIs, databases, and backend architecture solutions
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">Frontend Scripting</h3>
                  <p className="text-gray-300 text-sm">
                    Interactive user interfaces, responsive designs, and client-side functionality
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  Specializing in both backend and frontend development to deliver complete, end-to-end solutions for
                  your projects.
                </p>
              </div>
            </div>
          </section>

          {/* Social Links */}
          <div className="flex justify-center gap-6 pt-0">
            <Link href="https://x.com/iam3rik_dev" className="text-gray-400 hover:text-white text-sm">
              Twitter
            </Link>
            <Link href="https://discord.com/users/852104123428241428" className="text-gray-400 hover:text-white text-sm">
              Discord
            </Link>
            <Link href="https://github.com/iam3r1k" className="text-gray-400 hover:text-white text-sm">
              Github
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
