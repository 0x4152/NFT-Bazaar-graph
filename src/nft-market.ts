import { BigInt, Address } from "@graphprotocol/graph-ts"
//to use BigInt and Address on our event handlers we need to import the classes from graph
import {
  NFTMarket,
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent,
  UpdatedListing as UpdatedListingEvent
} from "../generated/NFTMarket/NFTMarket"
import { ItemListed, ActiveItem, ItemBought, ItemCanceled } from "../generated/schema"
export function handleItemBought(event: ItemBoughtEvent): void {
  //save event in our graph
  //update active item

  //get or create itemListed object, each item needs unique Id
  //ItemBought Event: just the raw event
  //ItemBought Object: What we actually save
  //ItemBought Objects and ItemBought Event are a specific type on TypeScript, we need to import the type structure so that 
  //this page understands what type we are using, the types are autocreated on the folder generated/schema.ts
  let itemBought = ItemBought.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))//even though they have the same Id, they are different typoes
  //we create a new ItemBought if it doesnt exist with its unique Id
  if(!itemBought) {
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
  }
  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId=event.params.tokenId
  itemBought.price=event.params.price
  activeItem!.buyer = event.params.buyer

  itemBought.save()
  activeItem!.save()
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let itemCanceled = ItemCanceled.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  let activeItem = ActiveItem.load(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))
  if(!itemCanceled) {
    itemCanceled = new ItemCanceled(getIdFromEventParams(event.params.tokenId, event.params.nftAddress))

  }
  itemCanceled.seller = event.params.seller
  itemCanceled.nftAddress = event.params.nftAddress
  itemCanceled.tokenId = event.params.tokenId
  /////////////////////////////////////////////
  //we change teh address of the active item to the dead address
  /////////////////////////////////////////////////////////////
  activeItem!.buyer = Address.fromString("0x000000000000000000000000000000000000dEaD")


  itemCanceled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
)
let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
)
if (!itemListed) {
    itemListed = new ItemListed(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
}
if (!activeItem) {
    activeItem = new ActiveItem(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
}
itemListed.seller = event.params.seller
activeItem.seller = event.params.seller

itemListed.nftAddress = event.params.nftAddress
activeItem.nftAddress = event.params.nftAddress

itemListed.tokenId = event.params.tokenId
activeItem.tokenId = event.params.tokenId

itemListed.price = event.params.price
activeItem.price = event.params.price

activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")

itemListed.save()
activeItem.save()
}

export function handleUpdatedListing(event: UpdatedListingEvent): void {


let activeItem = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
)

if (!activeItem) {
    activeItem = new ActiveItem(
        getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    )
}
activeItem!.price = event.params.price

activeItem!.save()



}


//function that creates a unique ID for each event on our list
function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString()
}