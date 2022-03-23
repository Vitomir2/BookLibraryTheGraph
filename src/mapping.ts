import { ContractEntity, AuthorEntity } from './../generated/schema';
import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  AddBook,
  BorrowBook,
  ReturnBook,
  OwnershipTransferred
} from "../generated/Contract/Contract"
import { BookEntity } from "../generated/schema"

export function handleAddBook(event: AddBook): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let bookEntity = BookEntity.load(event.params.bookId.toHexString());

  if (bookEntity == null) {
    bookEntity = new BookEntity(event.params.bookId.toHexString());
  }

  // BigInt and BigDecimal math are supported
  bookEntity.count = bookEntity.count.plus(BigInt.fromI32(1));

  // Entity fields can be set based on event parameters
  bookEntity.bookId = event.params.bookId;
  bookEntity.availableCopies = event.params.availableCopies;// bookEntity.availableCopies.plus(event.params.availableCopies);
  
  const copiesNumber = bookEntity.availableCopies;
  log.info("testing log " + copiesNumber.toString(), [ copiesNumber.toString() ]);
  //let authorID = event.params.bookId.toHexString();
  let authorID = "";
  let test = copiesNumber >= BigInt.fromI32(1) && copiesNumber <= BigInt.fromI32(10);
  log.info("if condition log range 1-10 " + test.toString(), [ test.toString() ]);
  test = copiesNumber >= BigInt.fromI32(11) && copiesNumber <= BigInt.fromI32(20);
  log.info("if condition log range 11-20 " + test.toString(), [ test.toString() ]);
  test = copiesNumber >= BigInt.fromI32(21) && copiesNumber <= BigInt.fromI32(30);
  log.info("if condition log 21-30 " + test.toString(), [ test.toString() ]);
  if (copiesNumber >= BigInt.fromI32(1) && copiesNumber <= BigInt.fromI32(10)) {
    //authorID = "Aauthor" + event.params.bookId.toHexString();
    authorID = "Aauthor";
    bookEntity.author = authorID;
  } else if (copiesNumber >= BigInt.fromI32(11) && copiesNumber <= BigInt.fromI32(20)) {
    //authorID = "Bauthor" + event.params.bookId.toHexString();
    authorID = "Bauthor";
    bookEntity.author = authorID;
  } else if (copiesNumber >= BigInt.fromI32(21) && copiesNumber <= BigInt.fromI32(30)) {
    //authorID = "Cauthor" + event.params.bookId.toHexString();                                                                                                                                                                  
    authorID = "Cauthor";
    bookEntity.author = authorID;
  } else {
    //authorID = "Dauthor" + event.params.bookId.toHexString();
    authorID = "Vauthor";
    bookEntity.author = authorID;
  }

  // Entities can be written to the store with `.save()`
  bookEntity.save()

  // save the author entity
  let authorEntity = AuthorEntity.load(authorID);
  if (!authorEntity) {
    authorEntity = new AuthorEntity(authorID);
  }

  authorEntity.save();

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.LIBToken(...)
  // - contract.getAmount(...)
  // - contract.getBook(...)
  // - contract.isAvailable(...)
  // - contract.isBookOwnedByCustomer(...)
  // - contract.owner(...)
  // - contract.wrapperContract(...)
}

export function handleBorrowBook(event: BorrowBook): void {
  let entity = BookEntity.load(event.params.bookId.toHexString());

  if (!entity) return;

  entity.availableCopies = entity.availableCopies.minus(BigInt.fromI32(1));
  entity.save();
}

export function handleReturnBook(event: ReturnBook): void {
  let entity = BookEntity.load(event.params.bookId.toHexString());

  if (!entity) return;

  entity.availableCopies = entity.availableCopies.plus(BigInt.fromI32(1));
  entity.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {
  if (!event.params.newOwner)
    return;

  if (event.params.previousOwner == event.params.newOwner)
    return;

  let entity = ContractEntity.load(event.address.toHex());
  
  if (!entity) {
    entity = new ContractEntity(event.address.toHex()); // initialize with the contract address
  }

  entity.owner = event.params.newOwner;
  entity.save();
}
