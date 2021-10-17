import {INFURA_ADDRESS, ADDRESS, ABI} from "../../config.js"
import Web3 from "web3";

// import the json containing all metadata. not recommended, try to fetch the database from a middleware if possible, I use MONGODB for example
import traits from "../../database/allTraits.json";

const infuraAddress = INFURA_ADDRESS

const biggusdApi = async(req, res) => {

    // SOME WEB3 STUFF TO CONNECT TO SMART CONTRACT
  const provider = new Web3.providers.HttpProvider(infuraAddress)
  const web3infura = new Web3(provider);
  const biggusdContract = new web3infura.eth.Contract(ABI, ADDRESS)
  


  // IF YOU ARE USING INSTA REVEAL MODEL, USE THIS TO GET HOW MANY NFTS ARE MINTED
//   const totalSupply = await biggusdContract.methods.totalSupply().call();
//   console.log(totalSupply)
  


// THE ID YOU ASKED IN THE URL
  const query = req.query.id;


  // IF YOU ARE USING INSTA REVEAL MODEL, UNCOMMENT THIS AND COMMENT THE TWO LINES BELOW
//   if(parseInt(query) < totalSupply) {
  const totalBigGusD = 10000;
  if(parseInt(query) < totalBigGusD) {


    // CALL CUSTOM TOKEN NAME IN THE CONTRACT
    const tokenNameCall = await biggusdContract.methods.biggusdNames(query).call();
    let tokenName = `#${query}${(tokenNameCall === '') ? "" : ` - ${tokenNameCall}`}`

    // IF YOU ARE NOT USING CUSTOM NAMES, JUST USE THIS
    // let tokenName= `#${query}`

    
    
    const signatures = [ 1519,9093,9731,7515,1601,4802,3198,8171,6333,5435,5016,6412,53,3595,9807,9338,7129,7154,6157,5318 ]
    const trait = traits[parseInt(query)]
    // const trait = traits[ Math.floor(Math.random() * 8888) ] // for testing on rinkeby 

    // CHECK OPENSEA METADATA STANDARD DOCUMENTATION https://docs.opensea.io/docs/metadata-standards
    let metadata = {}
    // IF THE REQUESTED TOKEN IS A SIGNATURE, RETURN THIS METADATA
    if ( signatures.includes( parseInt( query ) ) ) {
    
      metadata = {
        "name": tokenName,
        "description": "Big Gus D brings you the best way to impress your family, friends and lovers by showing with elegance, refinement and a little bit of humor who has really the BIGGEST one !",
        "tokenId" : parseInt(query),
        "image": `https://gateway.pinata.cloud/ipfs/${trait["imageIPFS"]}`,
        "external_url":"https://biggusd.co",
        "attributes": [   
          {
            "trait_type": "Signature Series",
            "value": trait["Signature Series"]
          }    
        ]
      }
      // console.log(metadata)
    } else {
    // GENERAL BIG GUS D METADATA
      metadata = {
        "name": tokenName,
        "description": "Big Gus D brings you the best way to impress your family, friends and lovers by showing with elegance, refinement and a little bit of humor who has really the BIGGEST one !",
        "tokenId" : parseInt(query),
        "image": `https://gateway.pinata.cloud/ipfs/${trait["imageIPFS"]}`,
        "external_url":"https://biggusd.co",
        "attributes": [          
            {
              "trait_type": "Background",
              "value": trait["Background"]
            },
            {
              "trait_type": "Body",
              "value": trait["Body"]
            },
            {
              "trait_type": "Arm",
              "value": trait["Arm"]
            },
            {
              "trait_type": "Face",
              "value": trait["Face"]
            },
            {
              "trait_type": "Head Gear",
              "value": trait["Head Gear"]
            },
			{
              "trait_type": "Pant",
              "value": trait["Pant"]
            },
			{
              "trait_type": "Length",
              "value": trait["Length"]
            },
			{
              "trait_type": "Width",
              "value": trait["Width"]
            }
    
        ]
      }
      
      // console.log(metadata)

    }
    
    res.statusCode = 200
    res.json(metadata)
  } else {
    res.statuscode = 404
    res.json({error: "The Big Gus D you requested is out of range"})

  }


  // this is after the reveal

  
}

export default biggusdApi