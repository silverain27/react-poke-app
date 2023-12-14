import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import { Loading } from '../../assets/Loading'
import { LessThan } from '../../assets/LessThan'
import { GreaterThan } from '../../assets/GreaterThan'
import { ArrowLeft } from '../../assets/ArrowLeft'
import { Balance } from '../../assets/Balance'
import { Vector } from '../../assets/Vector'
import { DamageRelations } from '../../components/DamageRelations'
import Type from '../../components/Type'
import BaseStat from '../../components/BaseStat'
import DamageModal from '../../components/DamageModal'

const DetailPage = () => {

    const [pokemon, setPokemon] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const params = useParams();
    const pokemonId = params.id; //여기에 이름이 들어가 있음
    useEffect(() => {
        setIsLoading(true)
      fetchPokemonData(pokemonId);
    }, [pokemonId])
    const baseurl = 'https://pokeapi.co/api/v2/pokemon/'
    async function fetchPokemonData(id){
        const url = `${baseurl}${id}`
        try{
            const {data : pokemonData} = await axios.get(url) 
            //response.data 를 바로 distructuring해서 가져오는거
            // response = await axios.get(url) 하면 -> response.data를 가져와서 사용해야한다. 근데 바로 {data}로 하면 가져오는 값에 data값이 들어감
            // {data : pokemonData } 하면 data라는 값을 pokemonData로 저장함 
            // console.log(pokemonData)
            if(pokemonData){
                const {name, id, types, weight, height, stats, abilities, sprites} = pokemonData;
                const nextAndPreviousPokemn = await getNextAndPreviousPokemon(id);
                


                //비동기 작업 다 처리하고 한꺼번에 리턴하는 것
                const DamageRelations = await Promise.all(
                    types.map(async(i)=>{
                        // console.log('i', i)
                        const type = await axios.get(i.type.url)
                        return type.data.damage_relations
                    })

                )


                const formattedPokemonData = {
                    id, 
                    name, 
                    weight : weight /10,
                    height: height/10,
                    previous: nextAndPreviousPokemn.previous,
                    next : nextAndPreviousPokemn.next,
                    abilities : formatPokemonAbilities(abilities),
                    stats : formatPokemonStats(stats),
                    DamageRelations,
                    types : types.map(type => type.type.name),
                    sprites : formaPokemonSprites(sprites),
                    description : await getPokemonDescription(id) //여기에 await을 안해주면 desciprion fullfilled 가 뜸 

                }
                console.log("formatted data ", formattedPokemonData)
                setPokemon(formattedPokemonData)
                setIsLoading(false)
            }

        }catch(error){
            console.error(error)
            setIsLoading(false)
        }
    }
    const filterAndFormatDescription=(flavorText)=>{
        const koreanDescriptions = flavorText
            ?.filter((text)=>text.language.name==="ko")
            .map((text)=> text.flavor_text.replace(/\r|\n|\f/g, ' '))
        // console.log("korean", koreanDescriptions)
        return koreanDescriptions
    }
    const getPokemonDescription = async (id)=>{
        const url =`https://pokeapi.co/api/v2/pokemon-species/${id}/`
        const {data:pokemonSpecies} = await axios.get(url)
        console.log("pokespecies", pokemonSpecies)
        const descriptions = filterAndFormatDescription(pokemonSpecies.flavor_text_entries) 
        //여기에 여러개가 들어가있는데 랜덤으로 하나만 보여주고싶음 

        return descriptions[Math.floor(Math.random() * descriptions.length)] //이건 이미 이해함 

 
    }

    const formaPokemonSprites = (sprites)=>{
        const newSprites = {...sprites}
        Object.keys(newSprites).forEach(key => {
            if(typeof newSprites[key]!=='string'){
                delete newSprites[key]
            }
        })
        return Object.values(newSprites)
    }
    // console.log(pokemon?.DamageRelations)
    const formatPokemonAbilities = (abilities)=>{
        return abilities.filter((_, index)=> index <= 1)
            .map((obj)=> obj.ability.name.replaceAll('-', ' ') )
    }
    const formatPokemonStats = ([
        statHP,
        statATk,
        statDEP,
        statSATK,
        statSDEP,
        statSPD
    ]) => [
        {name : 'Hit Points', baseStat : statHP.base_stat },
        {name : 'Attack', baseStat : statATk.base_stat },
        {name : 'Defense', baseStat : statDEP.base_stat },
        {name : 'Special Attack', baseStat : statSATK.base_stat },
        {name : 'Special Defense', baseStat : statSDEP.base_stat },
        {name : 'Speed', baseStat : statSPD.base_stat }

    ]

    async function getNextAndPreviousPokemon(id){
        const urlPokemon = `${baseurl}?limit=1&offset=${id-1}`
       
        const { data : pokemonData} = await axios.get(urlPokemon)
        // console.log("***", pokemonData)
        const nextResponse = pokemonData.next && (await axios.get(pokemonData.next))
        const previousResponse = pokemonData.previous && (await axios.get(pokemonData.previous))
        return {
            next: nextResponse?.data?.results?.[0]?.name,
            previous :previousResponse?.data?.results?.[0]?.name
        }
    }

    if(isLoading){
        return (
            <div className={
                'absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50'
            }>
                <Loading className = 'w-12 h-12 z-50 animate-spin text-slate-900'/>
            </div>
        )
    }
    if(!isLoading && !pokemon){
        return (
            <div>
                ..Not Found
            </div>
        )
    }

    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
    const bg = `bg-${pokemon?.types?.[0]}`
    const text = `text-${pokemon?.types?.[0]}`
    // console.log("pokemon", pokemon)


    return (
        <article className='flex items-center gap-1 flex-col w-full'>
            <div className={
                `${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`
                }
            >
                {pokemon.previous && (
                    <Link
                        className='absolute top-[40%] -translate-y-1/2 z-50 left-1'
                        to = {`/pokemon/${pokemon.previous}`}
                        >
                        <LessThan className = 'w-5 h-8 p-1'/>
                    </Link>
                    
                )}
                {pokemon.next && (
                    <Link
                        className='absolute top-[40%] -translate-y-1/2 z-50 right-1'
                        to = {`/pokemon/${pokemon.next}`}
                        >
                        <GreaterThan className = 'w-5 h-8 p-1'/>
                    </Link>
                    
                )}
                    <section className='w-full flex flex-col z-20 items-center justify-center relative h-full'>
                        <div className='absolute z-30 top-6 flex items-center w-full justify-between'>
                            <div className='flex items-center gap-1'>
                                <Link to="/">
                                    <ArrowLeft className='w-6 h-8 text-zinc-200' />
                                </Link>
                                <h1 className='text-zinc-200 font-bold text-xl capitalize'>
                                    {pokemon.name}
                                </h1>
                            </div>
                            <div className='text-zinc-200 font-bold text-md'>
                                #{pokemon.id.toString().padStart(3,'00')}
                            </div>
                            
                        </div>
                        <div className='relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-10'>
                            <img 
                                src={img}
                                width="100%"
                                height = "auto"
                                loading = "lazy"
                                alt={pokemon.name}
                                className={`object-contain h-full`}
                                onClick={()=>setIsModalOpen(true)} />
                        </div>
                        

                    </section>
                    <section className='w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4'>
                        <div className='flex items-center justify-center gap-4'>
                            {/*포켓몬 타입 */}
                            {pokemon.types.map((type)=> (
                                <Type key={type} type={type}/>
                            ))}
                            
                        </div>  
                
                        <h2 className={`text-base font-semibold ${text}`}>
                            정보 
                        </h2> 
                        <div className='flex w-full items-center justify-between maz-w-[400px] text-center'>
                            <div className='w-full'>
                                <h4 className='text-[0.5rem] text-zinc-100'>
                                    Weight
                                </h4>
                                <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-200'>
                                    <Balance />
                                    {pokemon.weight}kg
                                </div> 
                            </div>
                            <div className='w-full'>
                                <h4 className='text-[0.5rem] text-zinc-100'>
                                    Weight
                                </h4>
                                <div className='text-sm flex mt-1 gap-2 justify-center text-zinc-200'>
                                    <Vector />
                                    {pokemon.height}kg
                                </div> 
                            </div>
                            <div className='w-full'>
                                <h4 className='text-[0.5rem] text-zinc-100'>
                                    Weight
                                </h4>
                                    {pokemon.abilities.map((ability, index)=> (
                                        <div key={ability} className='text-[0.5rem] text-zinc-100 capitalize'>{ability}</div>
                                    ))}
                                
                            </div>
                            
                        </div>
                        <h2 className={`text-base font-semibold ${text}`}>
                            기본능력치 
                        </h2> 
                        <div className='w-full'>
                            
                            <table>
                                <tbody>
                                    {pokemon.stats.map((stat)=> (
                                        <BaseStat 
                                            key={stat.name}
                                            valueStat={stat.baseStat}
                                            nameStat={stat.name}
                                            type={pokemon.types[0]}/>   
                                    ))}
                                     
                                </tbody>
                            </table>
                                        
                        </div>

                        <h2 className={`text-base font-semibold ${text}`}>
                            설명    
                        </h2>
                        <p className='text-md leading-4 font-sans text-zinc-200 max-w-[30rem] text-center'>
                            {pokemon.description}
                        </p>
                                        
                        <div className='flex my-8 flex-wrap justify-center'>
                            {pokemon.sprites.map((url, index)=>(
                                <img key ={index} src={url} alt="sprites" />  
                            ))}

                        </div>
                        {/* {pokemon.DamageRelations && (
                            <div className='w-10/12'>

                                <h2 className={`text-base text-center font-semibold ${text}`}>
                                    <DamageRelations
                                    damages={pokemon.DamageRelations}/>
                                        
                                </h2>
                                     
                            </div>
                        )} */}
                    

                        
                    </section>
                    
                
            </div>
            {isModalOpen && <DamageModal 
                        setIsModalOpen={setIsModalOpen} 
                        damages={pokemon.DamageRelations}/>}
        </article>
    )
}

export default DetailPage